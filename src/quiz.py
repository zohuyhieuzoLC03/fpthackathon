import json
import sys
from claude_api import Client
import ast

claude_api = Client('intercom-device-id-lupk8zyo=96958da8-27bd-4d51-af4b-ae39b543078d; sessionKey=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; cf_clearance=o.EzDPmMfhvjt7cRce5vxtYCFr8mK9Ch3S9wnUDghFU-1694674687-0-1-bdd9e5d8.e9ce9645.ead8ba38-0.2.1694674687; __cf_bm=XEBqx6U_FaXQGITSkohdEMK8FBIrbyp6CmAmeEByDPU-1694675624-0-ASShFn68h799/bY333rGOaaJoxGGnLVyE1tk8ahBX94ElH9CGYuSf4+kRXmG0TFV87r6tqcVPsXAADd99tszNSU=')
conversation_id = claude_api.create_new_chat()['uuid']
input = sys.argv[1]
json_ex_quiz = """
[
    {
        "questionText": "Who is Prime Minister of India?",
        "answerOptions": [
            {"answerText": "Vijay Rupani", "isCorrect": False},
            {"answerText": "Manmohan Singh", "isCorrect": False},
            {"answerText": "Narendra Modi", "isCorrect": True},
            {"answerText": "Deep Patel", "isCorrect": False}
        ]
    },
    {
        "questionText": "Who is CEO of Tata?",
        "answerOptions": [
            {"answerText": "Jeff Bezos", "isCorrect": False},
            {"answerText": "Ratan Tata", "isCorrect": True},
            {"answerText": "Mukesh Ambani", "isCorrect": False},
            {"answerText": "Gautam Adani", "isCorrect": False}
        ]
    },
    {
        "questionText": "Who is the richest person in the world?",
        "answerOptions": [
            {"answerText": "Jeff Bezos", "isCorrect": False},
            {"answerText": "Elon Musk", "isCorrect": True},
            {"answerText": "Mukesh Ambani", "isCorrect": False},
            {"answerText": "Warren Buffett", "isCorrect": False}
        ]
    },
    {
        "questionText": "How many countries in the world?",
        "answerOptions": [
            {"answerText": "120", "isCorrect": False},
            {"answerText": "183", "isCorrect": False},
            {"answerText": "170", "isCorrect": False},
            {"answerText": "195", "isCorrect": True}
        ]
    }
];"""

output_text_quiz = ""
message_quiz = "hãy tạo ra 5 câu hỏi trắc nghiệm bằng tiếng Việt có 4 đáp án với 1 một đáp án đúng và 3 đáp án sai, viết 5 câu hỏi đó thành 1 file với cấu trúc như: \n" + json_ex_quiz + "\n về những vấn đề liên quan đến đoạn văn sau: \n" + input
# conversation_id = "f7b6da04-a597-4582-8caf-83b622f4b475"
conversation_id = claude_api.create_new_chat()['uuid']
output_text_quiz += claude_api.send_message(message_quiz, conversation_id)
deleted = claude_api.delete_conversation(conversation_id)

final_json = ''
state = False
stack_char = []
list_quiz = []

output_text_quiz = output_text_quiz.replace("true", "True")
output_text_quiz = output_text_quiz.replace("false", "False")
for c in output_text_quiz:

    if c == '{':
        if len(stack_char) == 0:
            state = True

        stack_char.append(c)
    if state == True:
        final_json += c
    if c == '}':

        stack_char.pop()
        if len(stack_char) == 0:
            dict_json = ast.literal_eval(final_json)
            final_json = ''
            list_quiz.append(dict_json)
            state = False

sys.stdout.write(json.dumps(list_quiz))
