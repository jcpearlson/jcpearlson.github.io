from game_board import board
import cv2
import logging
import os

class loadBoard:

    def __init__(self,fpath):

        if not  os.path.isfile(fpath):
            raise FileNotFoundError("File path not found")
        
        self.fpath = fpath
    
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
    def get_board(self):
        gray_grid = cv2.cvtColor(self.remove_boundaries(), cv2.COLOR_BGR2GRAY)
        contours, _ = cv2.findContours(gray_grid, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
        
        # might not be needed
        contours = sorted(contours, key=cv2.contourArea)

        total_cells = len(contours) - 2
        grid_size = int((total_cells)**(.5))

        if total_cells != grid_size**2:
            raise RuntimeError(f'Board cell count is off. total cells: {total_cells} grid size: {grid_size}')

        print(f'total cells: {total_cells}, grid size: {grid_size}')
        print('working up to here!')

        self.display(gray_grid,'gray grid',20)



    # Display cv2
    def display(self,obj,caption:str,time_seconds=0):
        cv2.imshow(caption, obj)
        cv2.waitKey(0)
        cv2.destroyAllWindows()



# /Users/joshuacarterpearlson/jcpearlson.github.io-1/wip/queensSolver/imgs/4.png
board = loadBoard('wip/queensSolver/imgs/4.png')
board.get_board()

# # Find contours again within the cropped grayscale grid
# contours, _ = cv2.findContours(gray, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
# # Sort contours by area
# contours = sorted(contours, key=cv2.contourArea)

# # Calculate the total number of cells and the grid size
# total_cells = len(contours) - 2
# grid_size = int((total_cells)**(.5))

# if total_cells != grid_size**2:
#     print("Unable to detect full grid! Aborting")

# # Calculate the width and height of each cell
# cell_width = w // grid_size
# cell_height = h // grid_size

# # Initialize variables to store colors and board configuration
# colors = []
# board = []
# color_index = 1
# color_map = {}
# reverse_color_map = {}
# padding = 10

# # Iterate through each cell in the grid to extract colors
# for i in range(grid_size):
#     row = []
#     for j in range(grid_size):
#         # Calculate cell coordinates with padding
#         cell_x = j * cell_width
#         cell_y = i * cell_height
#         padding = 15
#         cell = grid[cell_y+padding:cell_y+cell_height-padding, cell_x+padding:cell_x+cell_width-padding]
        
#         # Get the average color of the cell
#         avg_color = cell.mean(axis=0).mean(axis=0)
#         avg_color = avg_color.astype(int)
#         avg_color = tuple(avg_color)
        
#         # Map each unique color to an index
#         if avg_color not in color_map:
#             color_map[avg_color] = str(color_index)
#             reverse_color_map[str(color_index)] = avg_color
#             color_index += 1
#         row.append(color_map[avg_color])
        
#     # Append the row to the board configuration
#     board.append(row)

# print(board)