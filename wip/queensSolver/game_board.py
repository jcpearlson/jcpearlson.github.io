class board:
    def __init__(self,matrix:list,n:int):

        if (n and len(matrix) and len(matrix[0])) == False:
            raise ValueError('rows, columns, and n not all equal!')
        
        self.n = n
        self.matrix = matrix
        self.transpose_matrix = [list(row) for row in zip(*board)]

    # Inserts a value for both matrix and transpose matrix
    def change_value(self,x:int,y:int,v):
        self.matrix[x][y] = v
        self.transpose_matrix[y][x] = v

    # print out the board
    def draw_board(self):
        print("|" + "|\n|".join([",".join(r) for r in self.matrix]) + "|")

    def check_board_simple(self) -> list:
        """
        - Check board for whole row or whole column of just a number
        - X out any squares that are no longer possible
        - Place a queen on the board if a row and column requirement are perpendicular for the same value

        Returns:
        board - Modified with all above requirements
        """
        n = self.n

        # indexed (0 -> n-1), first list is row, second is column
        full_rows_cols = [([],[]) for i in n]
        
        for row in n:
            # if row contains only one number
            _set = set(self.matrix[row])
            if len(_set) == 1 or ( len(_set) == 2 and None in _set ):
                full_rows_cols[int(self.matrix[row][0]) - 1][0].append(row)
        
        # Loop through each column with transposed board
        for column in n:
            # same as before but for columns of transposed matrix
            _set = set(self.transpose_matrix)
            if len(_set) == 1 or ( len(_set) == 2 and None in _set ):
                full_rows_cols[int(self.transpose_matrix[column][0]) - 1][1].append(column)

        # Updates the board state
        for i in n:
            _tuple = full_rows_cols[i]
            if _tuple[0] and _tuple[1]:
                # TODO make placeQueen function
                # placeQueen()
                # TODO never tested this case
                print('untested case: place queen')

            elif _tuple[0]:
                # TODO never tested this case
                print('untested case: one row')

            elif _tuple[1]:
                # TODO never tested this case
                print('untested case: one column')
        


        

        