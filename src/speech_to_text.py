import requests
import json
import os
import sys
import soundfile as sf
import numpy as np

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

def slice_audio(file_path):
    TIME_MAX = 19
    audio_info = sf.info(file_path)

    duration = audio_info.duration
    audio, samplerate = sf.read(file_path)
    # print(audio.shape)
    start = 0
    list_audio = []
    count = 0
    if duration > TIME_MAX:
        while duration >= TIME_MAX:
            sub_audio = audio[start: start + int(samplerate * TIME_MAX)]
            sub_audio_path = file_path[:-4] + str(count) + file_path[-4:]
            list_audio.append(sub_audio_path)
            sf.write(sub_audio_path, sub_audio, samplerate)
            start += int(samplerate * TIME_MAX)
            duration -= TIME_MAX
            count += 1
        if duration >= 1:
            # print(duration)
            sub_audio = audio[start:]
            # print(sub_audio.shape)
            # print(count)
            sub_audio_path = file_path[:-4] + str(count) + file_path[-4:]
            list_audio.append(sub_audio_path)
            sf.write(sub_audio_path, sub_audio, samplerate)
        os.remove(file_path)
    else:
        list_audio.append(file_path)
    return list_audio

def convert_response_to_text(response):
    response = json.loads(response.text)

    text = ' '
    for segment in response:
        text += segment['result']['hypotheses'][0]['transcript_normed'] + ', '
    text = text.strip()
    if len(text) > 0:
        if text[-1] == ',':
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
    # print(response)
    if response is not None:
        text = convert_response_to_text(response)
    else:
        text = ''
    return text

file_path = 'sound/upload_sound.mp3'
if file_path is not None and os.path.exists(file_path) and os.path.isfile(file_path):
    list_audio = slice_audio(file_path)
    text = ''
    for audio_path in list_audio:
        text += convert_speech_file_to_text(audio_path) + ' '
        os.remove(audio_path)
    text = text.strip()
    # print(type(text))
    # print(text)
    sys.stdout.write(json.dumps(text))
else:
    pass

if __name__ == '__main__':
    pass