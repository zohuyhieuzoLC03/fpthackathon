import requests
import json
import os
import sys

def get_sound_file_from_folder():
    '''
        Find and get sound file from folder sound
    '''

    file_extension = ['.wav', '.mp3']
    folder_path = os.path.join(os.getcwd(), 'sound')

    file_list = os.listdir(folder_path)
    for file in file_list:
        for extension in file_extension:
            index = file.find(extension)
            if index >= 0:
                return os.path.join(folder_path, file)
    return None

def convert_response_to_text(response):
    response = json.loads(response.text)

    text = ' '
    for segment in response:
        text += segment['result']['hypotheses'][0]['transcript_normed'] + ', '
    text = text.strip()
    text = text[:-1]
    return text

def convert_speech_file_to_text(file_path: str):
    url = "https://viettelgroup.ai/voice/api/asr/v1/rest/decode_file"
    headers = {
        'token': 'anonymous',
        #'sample_rate': 16000,
        #'format':'S16LE',
        #'num_of_channels':1,
        #'asr_model': 'model code'
    }
    s = requests.Session()
    files = {'file': open(file_path,'rb')}
    response = requests.post(url,files=files, headers=headers)
    text = convert_response_to_text(response)
    return text

file_path = 'sound/upload_sound.mp3'
if file_path is not None and os.path.exists(file_path) and os.path.isfile(file_path):
    text = convert_speech_file_to_text(file_path)
    sys.stdout.write(json.dumps(text))
    # print(text)
    os.remove(file_path)
else:
    pass

if __name__ == '__main__':
    # result = convert_speech_file_to_text('./Recording.wav')
    # print(result)
    pass