from PIL import Image

img = Image.open("cards_final.png")    

card_width = 58
card_height = 72
rows = 4
cols = 13


start_x = 0  
start_y = 10 
v_spacing = 57
h_spacing = 10

suits = ["spades", "diamonds", "clubs", "hearts"]
ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"]

for row in range(rows):
    for col in range(cols):
        left = col * card_width
        upper = start_y + row * v_spacing
        right = left + card_width
        lower = upper + card_height
        card = img.crop((left, upper, right, lower))
        filename = f"{suits[row]}_{ranks[col]}.png"
        card.save(filename)
