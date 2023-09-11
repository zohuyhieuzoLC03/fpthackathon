from PIL import Image
import pytesseract
import json
import sys
import os

def get_image_from_folder():
    '''
        Find and get image from folder src/image
    '''

    file_extension = ['.png', '.jpg', '.jpeg']
    folder_path = os.path.join(os.getcwd(), 'image')

    file_list = os.listdir(folder_path)
    for file in file_list:
        for extension in file_extension:
            index = file.find(extension)
            if index >= 0:
                return os.path.join(folder_path, file)
    return None

def image_to_text(image_path: str):
    '''
        Find text in an image and write it to json, then delete image file immediately

        Args:
            image_path: the path to the image need finding text
            conf_thresh: the thresh of the confidence to define if it is text
    '''

    image = Image.open(image_path)
    if image.mode == 'RGB':
        pass
    else:
        image = image.convert('RGB')

    # results = pytesseract.image_to_data(image = image, lang = 'vie', output_type= pytesseract.Output.DICT)
    # text = ""
    # for i in range(0, len(results["text"])):
        
    #     # We will also extract the OCR text itself along
    #     # with the confidence of the text localization
    #     word = results["text"][i]
    #     conf = int(results["conf"][i])
        
    #     # filter out weak confidence text localizations
    #     if conf > conf_thresh:
    #         text += " " + word
    # text = text.strip()

    text = pytesseract.image_to_string(image, lang = 'vie')
    # print(text)
    return text

image_path = get_image_from_folder()
if image_path is not None and os.path.exists(image_path) and os.path.isfile(image_path):
    text = image_to_text(image_path)
    os.remove(image_path)
    sys.stdout.write(json.dumps(text))
else:
    pass

if __name__ == '__main__':
    pass