import json
import sys
from claude_api import Client
import ast

claude_api = Client('__cf_bm=zbj.steKHP7KcC8LPLd1YeNZwuf1GJ3Kwp3OsrGi5TI-1694158192-0-AX/72QkbvQmtrfngcfUYQRrdxDnzjsTKnFDVhn9mRpNJdVbaTMJLf0T9mPNRvFTCl4LPtsKPJeR4DPogdMoCSeI=; cf_clearance=AukbNCkoS2LCyUmkws9ejgFcl5K88GJel8MwpRmE8hw-1694158192-0-1-bae731ea.92aaac20.ede66e0a-0.2.1694158192; sessionKey=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')
conversation_id = claude_api.create_new_chat()['uuid']
input = sys.argv[1]
json_ex_quiz = """
[
    {
        "questionText": "The Prime Minister of India is Narendra Modi",
        "answerOptions": [
            {"answerText": "True", "isCorrect": True},
            {"answerText": "False", "isCorrect": False}
        ]
    },
    {
        "questionText": "The CEO of Tata is Jeff Bezos",
        "answerOptions": [
            {"answerText": "True", "isCorrect": False},
            {"answerText": "False", "isCorrect": True}
        ]
    },
    {
        "questionText": "The richest person in the world is Elon Musk",
        "answerOptions": [
            {"answerText": "True", "isCorrect": True},
            {"answerText": "False", "isCorrect": False}
        ]
    },
    {
        "questionText": "There are 120 countries in the world",
        "answerOptions": [
            {"answerText": "True", "isCorrect": False},
            {"answerText": "False", "isCorrect": True}
        ]
    }
];"""

output_text_quiz = ""
message_quiz = "hãy tạo ra 5 câu hỏi trắc nghiệm có dạng true-false bằng tiếng Việt có 2 đáp án với 1 một đáp án đúng và 1 đáp án sai, viết 5 câu hỏi đó thành 1 file với cấu trúc như: \n" + json_ex_quiz + "\n về những vấn đề liên quan đến đoạn văn sau: \n" + input
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