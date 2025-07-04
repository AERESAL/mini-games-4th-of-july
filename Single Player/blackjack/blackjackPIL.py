from PIL import Image

img = Image.open("playing_cards_x1.png")
rows, cols = 4, 13
card_width = img.width // cols
card_height = img.height // rows

for row in range(rows):
    for col in range(cols):
        left = col * card_width
        upper = row * card_height
        right = left + card_width
        lower = upper + card_height
        card = img.crop((left, upper, right, lower))
        
        suits = ["spades", "diamonds", "clubs", "hearts"]
        ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"]
        filename = f"{suits[row]}_{ranks[col]}.png"
        
        card.save(filename)
