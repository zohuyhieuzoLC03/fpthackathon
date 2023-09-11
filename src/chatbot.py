import sys
import json
from claude_api import Client
claude_api = Client('__cf_bm=zbj.steKHP7KcC8LPLd1YeNZwuf1GJ3Kwp3OsrGi5TI-1694158192-0-AX/72QkbvQmtrfngcfUYQRrdxDnzjsTKnFDVhn9mRpNJdVbaTMJLf0T9mPNRvFTCl4LPtsKPJeR4DPogdMoCSeI=; cf_clearance=AukbNCkoS2LCyUmkws9ejgFcl5K88GJel8MwpRmE8hw-1694158192-0-1-bae731ea.92aaac20.ede66e0a-0.2.1694158192; sessionKey=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')
conversation_id = claude_api.create_new_chat()['uuid']
text = sys.argv[1]

output_chatbot = ""
message_chatbot = text
conversation_id = claude_api.create_new_chat()['uuid']
output_chatbot += claude_api.send_message(message_chatbot, conversation_id)
deleted = claude_api.delete_conversation(conversation_id)

sys.stdout.write(json.dumps(output_chatbot))