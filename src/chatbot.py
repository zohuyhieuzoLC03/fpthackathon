import sys
import json
from claude_api import Client
claude_api = Client('intercom-device-id-lupk8zyo=96958da8-27bd-4d51-af4b-ae39b543078d; sessionKey=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; __cf_bm=31E_OWYu1Rh4dLzL4knA1tTR6EGcrakxr.wK0VwSMQU-1694663777-0-AVRL2CLgep0u2Pgs9zlQHbAXOw2NdZpZi57Lq5JD4dD3YTO03EFqrEMX+ofMFAZJ6lEf+YV34iKxMlShj8tcCbg=; cf_clearance=yXbhqlrOWiydtTqfEDFWY2VJPuuioZVJngtzEPYzGHA-1694663779-0-1-9f252fb7.a5f70ed1.c8247057-0.2.1694663779')
conversation_id = claude_api.create_new_chat()['uuid']
text = sys.argv[1]

output_chatbot = ""
message_chatbot = text
conversation_id = claude_api.create_new_chat()['uuid']
output_chatbot += claude_api.send_message(message_chatbot, conversation_id)
deleted = claude_api.delete_conversation(conversation_id)

sys.stdout.write(json.dumps(output_chatbot))