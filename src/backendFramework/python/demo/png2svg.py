from wand.image import Image
import os

try:
    input_file = '图层 5.png'
    output_file = 'output.svg'
    
    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Input file {input_file} not found")
        
    with Image(filename=input_file) as img:
        img.format = 'svg'
        img.save(filename=output_file)
        print(f"Conversion successful: {os.path.getsize(output_file)} bytes")

except Exception as e:
    print(f"Error occurred: {str(e)}")