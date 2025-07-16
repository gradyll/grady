# from wand.image import Image
 
# with Image(filename='your_image.png') as img:
#     img.format = 'svg'
#     img.save(filename='output.svg')

from wand.image import Image

with Image(filename='图层 5.png') as img:
    img.format = 'svg'
    img.save(filename='output.svg')