#imports
from re import template
import cv2
import pyautogui
from time import sleep


# 
# This python doc will control the screen
# Essentially its tasks boil down to
# - Locate the start button on the linkedin page
# - Click start button 
# - Take screenshot of the board and pass it to load_board
# - make mouse movement as required by game_board
# - place queens or x's depending on the mode!
# 

# #No cooldown time
pyautogui.PAUSE = 0

# game window dimensions for nqueens
x, y, w, h = 550, 320, 409, 410

#screenshot return cv2 read of state
def screenshot_read_screen_state():
    img = pyautogui.screenshot()
    img.save('imgs/image.png')
    return cv2.imread("imgs/image.png")

def load_test_image():
    return cv2.imread('imgs/queensGameTestImage.png')

def main():
    while True:
        test_image = load_test_image()
        # cv2.imshow('vision',test_image)
        # cv2.waitKey(100000)
        # Drawing a line
        line = cv2.line(test_image, (test_image.shape[1]//2, test_image.shape[0]//2), (0,0) , (0,255,0), thickness=2)
        cv2.imshow("line", line)

        # Drawing other shapes
        circle = cv2.circle(line, (line.shape[1]//2, line.shape[0]//2), 50, (0,0,255), thickness=2)
        rect = cv2.rectangle(circle, (10,10), (circle.shape[1]//2, circle.shape[0]//2), (255,0,0), thickness=2)
        text = cv2.putText(rect, "Hi", (rect.shape[1]//2, rect.shape[0]//2), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), thickness=2)

        cv2.imshow("all shapes", text)






if __name__ == '__main__':
    main()