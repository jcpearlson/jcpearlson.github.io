import cv2
import logging
import os
from game_board import board

logging.basicConfig(
    level=logging.DEBUG,                
    format='%(asctime)s - %(levelname)s - %(message)s', 
    handlers=[                          
        logging.StreamHandler()          
    ]
)

class loadBoard(board):

    def __init__(self,fpath):

        if not  os.path.isfile(fpath):
            raise FileNotFoundError("File path not found")
        
        self.fpath = fpath
        self.matrix = self._get_matrix_board()
        self.n = len(self.matrix)  
        super().__init__(self.matrix, self.n)  

    def get_matrix(self):
        return self.matrix
    
    def remove_boundaries(self):
        image =  cv2.imread(self.fpath)

        if image is None:
            raise ImportError("Image loaded in as null")
        
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        contours, _ = cv2.findContours(gray_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)

        # second largest contour is the boundary of the actual game 
        # TODO confirm this with more testing
        x, y, w, h = cv2.boundingRect(contours[1])
        logging.info(f'cutting image down. x:{x} y:{y} w:{w} h:{h}')

        # Crop to grid of just game
        return image[y:y+h, x:x+w]

    # Returns the board with only a filePath to an image of a board
    def _get_matrix_board(self):
        grid = self.remove_boundaries()
        gray_grid = cv2.cvtColor(grid, cv2.COLOR_BGR2GRAY)
        contours, _ = cv2.findContours(gray_grid, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
        
        # might not be needed
        contours = sorted(contours, key=cv2.contourArea)

        total_cells = len(contours) - 2
        grid_size = int((total_cells)**(.5))

        if total_cells != grid_size**2:
            raise RuntimeError(f'Board cell count is off. total cells: {total_cells} grid size: {grid_size}')
        
        # get height and width of grid
        height, width = gray_grid.shape[:2]

        # calculate the width and height of all cells
        cell_width = width // grid_size
        cell_height = height // grid_size

        # Initialize variables to store colors and board configuration
        colors = []
        board = []
        color_index = 1
        color_map = {}
        reverse_color_map = {}
        padding = 10

        # Iterate through each cell in the grid to extract colors
        for i in range(grid_size):
            row = []
            for j in range(grid_size):
                # Calculate cell coordinates with padding
                cell_x = j * cell_width
                cell_y = i * cell_height
                padding = 15
                cell = grid[cell_y+padding:cell_y+cell_height-padding, cell_x+padding:cell_x+cell_width-padding]
                
                # Get the average color of the cell
                avg_color = cell.mean(axis=0).mean(axis=0)
                avg_color = avg_color.astype(int)
                avg_color = tuple(avg_color)
                
                # Map each unique color to an index
                if avg_color not in color_map:
                    color_map[avg_color] = color_index
                    reverse_color_map[color_index] = avg_color
                    color_index += 1
                row.append(color_map[avg_color])
                
            # Append the row to the board configuration
            board.append(row)

        return board

    # Display cv2
    def _display(self,obj,caption:str,time_seconds=0):
        cv2.imshow(caption, obj)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

