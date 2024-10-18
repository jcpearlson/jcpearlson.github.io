import logging 

logging.basicConfig(
    level=logging.DEBUG,                
    format='%(asctime)s - %(levelname)s - %(message)s', 
    handlers=[                          
        logging.StreamHandler()          
    ]
)

class board:

    def __init__(self,matrix:list,n:int):

        if (n and len(matrix) and len(matrix[0])) == False:
            raise ValueError('rows, columns, and n not all equal!')
        
        self.n = n
        self.matrix = matrix
        self.transpose_matrix = [list(row) for row in zip(*self.matrix)]

    # Inserts a value for both matrix and transpose matrix
    def change_value(self,x:int,y:int,v):
        self.matrix[x][y] = v
        self.transpose_matrix[y][x] = v

    # print out the board in a ~very~ pretty and understandable way
    def draw_board(self):
        cell_width = max(len(str(item)) for row in self.matrix for item in row) + 2
        
        def print_row(row, row_idx):
            row_line = "|"
            for i in range(len(row)):
                row_line += f" {str(row[i]):{cell_width - 2}} "
                
                if i == len(row) - 1 or row[i] != row[i + 1]:
                    row_line += "|"
                else:
                    row_line += " " 
            print(row_line)
        
        def print_separator(row_idx):
            separator = "+"
            for i in range(len(self.matrix[0])):
                if row_idx == len(self.matrix) - 1 or self.matrix[row_idx][i] != self.matrix[row_idx + 1][i]:
                    separator += "-" * cell_width + "+"
                else:
                    separator += " " * cell_width + "+"  
            print(separator)

        for row_idx in range(len(self.matrix)):
            if row_idx == 0:
                print("+" + "+".join(["-" * cell_width] * len(self.matrix[0])) + "+")
            print_row(self.matrix[row_idx], row_idx)
            print_separator(row_idx)


    def check_board_whole_row_col(self) -> list:
        """
        - Check board for whole row or whole column of just a number
        - X out any squares that are no longer possible
        - Place a queen on the board if a row and column requirement are perpendicular for the same value

        Returns:
        board - Modified with all above requirements
        """
        n = range(self.n)

        # indexed (0 -> n-1), first list is row, second is column
        full_rows_cols = [([],[]) for i in n]
        
        for row in n:
            # if row contains only one number
            _set = set(self.matrix[row])
            if len(_set) == 1 or ( len(_set) == 2 and -1 in _set ):
                full_rows_cols[int(self.matrix[row][0]) - 1][0].append(row)
        
        # Loop through each column with transposed board
        for column in n:
            # same as before but for columns of transposed matrix
            _set = set(self.transpose_matrix[column])
            if len(_set) == 1 or ( len(_set) == 2 and -1 in _set ):
                full_rows_cols[int(self.transpose_matrix[column][0]) - 1][1].append(column)

        # Updates the board state 
        # NOTE each i value here is a number associated with a queens color! 
        # and i+1 is the actual value on the board! 
        for i in n:
            _tuple = full_rows_cols[i]

            if _tuple[0]:
                # Loop through the whole matrix, for every value we find that is not in the row, we change it to None!
                self.remove_all_but_in_row(_tuple[0][0],i+1)
                logging.info(f'removed all value:{i+1} but in row {_tuple[0][0]}')
                # raise RuntimeWarning('untested case: one row')
                # raise RuntimeError(f'untested case: one row')

            if _tuple[1]:
                self.remove_all_but_in_col(_tuple[1][0],i+1)
                logging.info(f'removed all value:{i+1} but in col {_tuple[1][0]}')
                raise RuntimeError('untested case: one column')
    
    def place_obvious_queens(self): 
        """Places queens that have no other possible location!"""
        # TODO this needs to be finished
        raise NotImplementedError()
    
    def place_queen(self,row:int,col:int):
        """Places a queen and removes all possible other locations for other queens"""

        # remove row x from possible
        for _col in range(self.n):
            if self.matrix[row][_col] != -1:
                self.change_value(row,_col,-1)

        # remove col y from possible
        for _row in range(self.n):
            if self.matrix[_row][col] != -1:
                self.change_value(_row,col,-1)

        # remove 4 corners from possible if they all exist 
        for r,c in [(1,1),(1,-1),(-1,1),(-1,-1)]:
                _row = row+r
                _col = col+c
                if _row < self.n and _row > -1:
                    if _col < self.n and _col > -1:
                        if self.matrix[_row][_col] != -1:
                            self.change_value(_row, _col, -1)

        # place down the queen
        self.change_value(row,col,'Q')
        


    def remove_all_but_in_row(self,row:int,value:int):
        for _row in range(self.n):
            if _row != row:
                for _col in range(self.n):
                    # replace spot with None as no queen can ever go there
                    if int(self.matrix[_row][_col]) == value:
                        self.change_value(_row,_col,-1)

    def remove_all_but_in_col(self,col:int,value:int):
        for _col in range(self.n):
            if _col != col:
                for _row in range(self.n):
                    # replace spot with None as no queen can ever go there
                    if int(self.matrix[_row][_col]) == value:
                        # TODO check if this is right... not too sure
                        self.change_value(_row,_col,-1)



        

        