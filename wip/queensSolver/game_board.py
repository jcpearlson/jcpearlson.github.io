import logging 
from collections import Counter
import copy

logging.basicConfig(
    level=logging.ERROR,                
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
        self.og_matrix = matrix
        self.transpose_matrix = [list(row) for row in zip(*self.matrix)]
        self.queens_placed = [False]*n

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
                # -2 is a queen so we display as a queen
                val = row[i]
                if val == -2:
                    val = 'Q'
                    
                row_line += f" {str(val):{cell_width - 2}} "
                
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
        - X out any squares that are no longer possible (give them value of -1)

        Returns:
        board - Modified with all above requirements
        """
        n = range(self.n)

        # indexed (0 -> n-1), first list is row, second is column
        full_rows_cols = [([],[]) for i in n]

        # check row for same value
        for row in n:
            unique_values = set()
            for col in n:
                value = self.matrix[row][col]
                if value not in (-1,-2):
                    unique_values.add(value)

            if len(unique_values) == 1:
                full_rows_cols[int(unique_values.pop()) -1][0].append(row)

        # check col for same value
        for col in n:
            unique_values = set()
            for row in n:
                value = self.matrix[row][col]
                if value not in (-1,-2):
                    unique_values.add(value)

            if len(unique_values) == 1:
                full_rows_cols[int(unique_values.pop()) -1][1].append(col)

        # Updates the board state 
        # NOTE each i value here is a number associated with a queens color! 
        # and i+1 is the actual value on the board! 

        # logging.debug(f'''{full_rows_cols=}''')
        for i in n:
            _tuple = full_rows_cols[i]

            if _tuple[0]:
                # Loop through the whole matrix, for every value we find that is not in the row, we change it to None!
                self.remove_all_but_in_row(_tuple[0][0],i+1)
                logging.info(f'removed all value:{i+1} but in row {_tuple[0][0]}')

            if _tuple[1]:
                self.remove_all_but_in_col(_tuple[1][0],i+1)
                logging.info(f'removed all value:{i+1} but in col {_tuple[1][0]}')
    
    def place_obvious_queens(self): 
        """Places queens that have no other possible location!"""

        n = range(self.n)

        # if row contains only one number once and -1
        for row in n:
            _seen_value = False
            place_queen = False
            queen_col = -1
            for col in n:
                value = self.matrix[row][col]
                if value not in [-1,-2]:
                    if _seen_value == False:
                        _seen_value = True
                        place_queen = True
                        queen_col = col
                    else:
                        place_queen = False
                        break
                    

            if place_queen:
                self.place_queen(row,queen_col)

        # If any column contains only one number once and -1
        for col in n:
            _seen_value= False
            place_queen = False
            queen_row = -1
            for row in n:
                if self.matrix[row][col] not in [-1,-2]:
                    if _seen_value == False:
                        _seen_value = True
                        place_queen = True
                        queen_row = row
                    else:
                        place_queen = False
                        break

            if place_queen:
                self.place_queen(queen_row,col)
            
        # if only one spot of the number is on the whole board then place a queen there
        value_counts = {}
        for row in n:
            for col in n:
                value = int(self.matrix[row][col])
                if value != -1:
                    if value not in value_counts.keys():
                        value_counts[value] = 1
                    else:
                        value_counts[value] += 1

        # make a list that is the numbers in value counts that has count of exactly one
        unique_values = [key for key, count in value_counts.items() if count == 1]

        # Optionally place a queen on the positions that contain these unique values
        for row in n:
            for col in n:
                if self.matrix[row][col] in unique_values:
                    self.place_queen(row, col)

    def is_solvable(self):
        """Checks if all numbers have a place to be put on board or have been placed so far"""

        false_indices = [index for index, value in enumerate(self.queens_placed) if not value]

        if not false_indices:
            return True
        
        unseen_values = [x + 1 for x in false_indices]

        for row in range(self.n):
            for col in range(self.n):
                value = self.matrix[row][col]
                if value in unseen_values:
                    unseen_values.remove(value)
                    if not unseen_values:
                        return True
        return False


    def find_all_no_queen_placement_squares(self):
        """
        This method will find all places on the board where it is impossible to place a queen.
        This can be thought of logically as: if placequeen -> not puzzle solvable then place -1
        It will place a queen on every single location and see if it blocks a full color region from existing, if it does then this place is a -1 square
        """

        for row in range(self.n):
            for col in range(self.n):
                if self.matrix[row][col] not in [-1,-2]:
                    # deep copy array
                    _temp = copy.deepcopy(self.matrix)
                    _temp_queens_placed = copy.deepcopy(self.queens_placed)
                    # place queen
                    self.place_queen(row,col)
                    
                    _is_solvable_bool = self.is_solvable()
                    
                    # return matrix back to normal
                    self.matrix = _temp                
                    self.queens_placed = _temp_queens_placed

                    # if puzzle is not solvable than place a -1
                    if not _is_solvable_bool:
                        self.change_value(row,col,-1)
                    

        # raise NotImplementedError()

    def place_queen(self,row:int,col:int):
        """Places a queen and removes all possible other locations for other queens"""

        if self.matrix[row][col] == -1:
            raise ValueError("Can not place queen into -1 slot")
        
        # if value exists in other places remove it as we are about to place queen for that location
        value = self.matrix[row][col]
        for _col in range(self.n):
            for _row in range(self.n):
                if self.matrix[_row][_col] == value:
                    self.change_value(_row,_col,-1)
        
        # add queen placement to our array
        self.queens_placed[value-1] = True

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
        self.change_value(row,col,-2)
        
    def solve_puzzle(self):
        counter = 0
        while False in self.queens_placed:
            counter +=1

            if counter %100 == 0:
                self.draw_board()

            if counter > 10000:
                break

            self.place_obvious_queens()
            self.check_board_whole_row_col()   
            self.find_all_no_queen_placement_squares()


        logging.info(f'solved queens in {counter} cycles')

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
                        self.change_value(_row,_col,-1)



        

        