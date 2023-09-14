import sys
import json
from claude_api import Client
claude_api = Client('intercom-device-id-lupk8zyo=96958da8-27bd-4d51-af4b-ae39b543078d; sessionKey=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; cf_clearance=o.EzDPmMfhvjt7cRce5vxtYCFr8mK9Ch3S9wnUDghFU-1694674687-0-1-bdd9e5d8.e9ce9645.ead8ba38-0.2.1694674687; __cf_bm=XEBqx6U_FaXQGITSkohdEMK8FBIrbyp6CmAmeEByDPU-1694675624-0-ASShFn68h799/bY333rGOaaJoxGGnLVyE1tk8ahBX94ElH9CGYuSf4+kRXmG0TFV87r6tqcVPsXAADd99tszNSU=')
conversation_id = claude_api.create_new_chat()['uuid']
text = sys.argv[1]

output_chatbot = ""
message_chatbot = text
conversation_id = claude_api.create_new_chat()['uuid']
output_chatbot += claude_api.send_message(message_chatbot, conversation_id)
deleted = claude_api.delete_conversation(conversation_id)

sys.stdout.write(json.dumps(output_chatbot))