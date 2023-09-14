import json
import sys
import ast
from claude_api import Client

# nodes = "{'001': {'_key': '001', 'name': 'Lịch sử Việt Nam', 'father': '', 'sortList': ['002', '003'], 'contract': False}, '002': {'_key': '002', 'name': 'Thời kỳ đồ đá cũ', 'father': '001', 'sortList': ['004', '005', '006', '007', '008'], 'contract': False}, '003': {'_key': '003', 'name': 'Văn hóa Sơn Vi', 'father': '001', 'sortList': [], 'contract': False}, '004': {'_key': '004', 'name': 'Hang Thẩm Hoi', 'father': '002', 'sortList': [], 'contract': False}, '005': {'_key': '005', 'name': 'Hang Thẩm Khuyên', 'father': '002', 'sortList': [], 'contract': False}, '006': {'_key': '006', 'name': 'Núi Đọ', 'father': '002', 'sortList': [], 'contract': False}, '007': {'_key': '007', 'name': 'Thung Lang', 'father': '002', 'sortList': [], 'contract': False}, '008': {'_key': '008', 'name': 'Nga Sơn', 'father': '002', 'sortList': [], 'contract': False}, '009': {'_key': '009', 'name': 'Bán đảo Malaysia, đảo Java, Sumatra và Kalimantan của Indonesia', 'father': '002', 'sortList': [], 'contract': False}, '010': {'_key': '010', 'name': 'Khai thác đá gốc', 'father': '002', 'sortList': ['011'], 'contract': False}, '011': {'_key': '011', 'name': 'Công cụ đá', 'father': '010', 'sortList': ['012', '013', '014', '015'], 'contract': False}, '012': {'_key': '012', 'name': 'Mảnh đá vỡ (mảnh tước)', 'father': '011', 'sortList': [], 'contract': False}, '013': {'_key': '013', 'name': 'Mũi nhọn', 'father': '011', 'sortList': [], 'contract': False}, '014': {'_key': '014', 'name': 'Rìa lưỡi dọc', 'father': '011', 'sortList': [], 'contract': False}, '015': {'_key': '015', 'name': 'Rìa lưỡi ngang', 'father': '011', 'sortList': [], 'contract': False}, '016': {'_key': '016', 'name': 'Núi Đọ', 'father': '003', 'sortList': [], 'contract': False}, '017': {'_key': '017', 'name': 'Hệ sinh thái miền nhiệt - ẩm', 'father': '003', 'sortList': [], 'contract': False}, '018': {'_key': '018', 'name': 'Thế giới động vật và thực vật phong phú, đa dạng', 'father': '003', 'sortList': [], 'contract': False}, '019': {'_key': '019', 'name': 'Thời kỳ nước biển xuống thấp', 'father': '', 'sortList': [], 'contract': False}}"
# load = ast.literal_eval(nodes)
# sys.stdout.write(json.dumps(load))
claude_api = Client('intercom-device-id-lupk8zyo=96958da8-27bd-4d51-af4b-ae39b543078d; sessionKey=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; cf_clearance=o.EzDPmMfhvjt7cRce5vxtYCFr8mK9Ch3S9wnUDghFU-1694674687-0-1-bdd9e5d8.e9ce9645.ead8ba38-0.2.1694674687; __cf_bm=XEBqx6U_FaXQGITSkohdEMK8FBIrbyp6CmAmeEByDPU-1694675624-0-ASShFn68h799/bY333rGOaaJoxGGnLVyE1tk8ahBX94ElH9CGYuSf4+kRXmG0TFV87r6tqcVPsXAADd99tszNSU=')
conversation_id = claude_api.create_new_chat()['uuid']
input = sys.argv[1]
json_ex = """{
"001": {
        "_key": "001",
        "name": "Node Main",
        "father": "",
        "sortList": ["002", "003", "004", "005"],
    },
    "002": {
        "_key": "002",
        "name": "Two",
        "father": "001",
        "sortList": ["006", "007"],
    },
    "003": {
        "_key": "003",
        "name": "Three",
        "father": "001",
        "sortList": []
    },
    "004": {
        "_key": "004",
        "name": "Four",
        "father": "001",
        "sortList": []
    },
    "005": {
        "_key": "005",
        "name": "Five",
        "father": "001",
        "sortList": []
    },
    "006": {
        "_key": "006",
        "name": "Six",
        "father": "002",
        "contract": False,
        "sortList": ["008", "009"]
    },
    "007": {
        "_key": "007",
        "name": "Seven",
        "father": "002",
        "sortList": []
    },
    "008": {
        "_key": "008",
        "name": "Eight",
        "father": "006",
        "sortList": []
    },
    "009": {
        "_key": "009",
        "name": "Nine",
        "father": "006",
        "sortList": ["010"]
    },
    "010": {
        "_key": "010",
        "name": "aiu",
        "father": "009",
        "sortList": []
    }
}"""
output_text=''
message = "Phân tích toàn bộ thông tin từ đoạn văn sau một cách chi tiết hết mức có thể thành file json có cấu trúc như một sơ đồ tư duy (mindmap) bằng tiếng Việt, _key phải là những số tự nhiên, cấu trúc giống như:" + json_ex + "\nkhông cần chú thích hay giải thích cho sơ đồ, và hãy có nhiều node cho đoạn văn dài" + " đây là đoạn văn mà bạn cần phân tích thành mindmap:\n" + input
conversation_id = claude_api.create_new_chat()['uuid']
output_text += claude_api.send_message(message, conversation_id)
deleted = claude_api.delete_conversation(conversation_id)

final_json = ''
state = False
stack_char = []
for c in output_text:

    if c == '{':
        if len(stack_char) == 0:
            state = True

        stack_char.append(c)
    if state == True:
        final_json += c
    if c == '}':
        stack_char.pop()
        if len(stack_char) == 0:
            state = False
            break

start_node = "001"
start_index = final_json.find(f'"{start_node}"')
final_json = final_json[start_index:(len(final_json)-1)]
final_json = '{' + final_json + '}'

new_s = ast.literal_eval(final_json)

# new_s = {
#     "001": {
#         "_key": "001",
#         "name": "Nội dung chính",
#         "father": "",
#         "sortList": ["002", "003", "004", "005"]
#     },
#     "002": {
#         "_key": "002",
#         "name": "Gia cảnh",
#         "father": "001",
#         "sortList": ["006", "007", "008", "009"]
#     },
#     "003": {
#         "_key": "003",
#         "name": "Lúc đi bán diêm",
#         "father": "001",
#         "sortList": ["010", "011", "012", "013"]
#     },
#     "004": {
#         "_key": "004",
#         "name": "Hiện thực (phũ phàng)",
#         "father": "001",
#         "sortList": ["014", "015", "016", "017", "018"]
#     },
#     "005": {
#         "_key": "005",
#         "name": "Những mộng tưởng (Đẹp đẽ)",
#         "father": "001",
#         "sortList": ["019", "020", "021", "022", "023"]
#     },
#     "006": {
#         "_key": "006",
#         "name": "Mồ côi mẹ",
#         "father": "002",
#         "sortList": []
#     },
#     "007": {
#         "_key": "007",
#         "name": "Bố qua đời",
#         "father": "002",
#         "sortList": []
#     },
#     "008": {
#         "_key": "008",
#         "name": "Bố hay la mắng",
#         "father": "002",
#         "sortList": []
#     },
#     "009": {
#         "_key": "009",
#         "name": "Nghèo, đi bán diêm",
#         "father": "002",
#         "sortList": []
#     },
#     "010": {
#         "_key": "010",
#         "name": "Đêm giao thừa",
#         "father": "003",
#         "sortList": []
#     },
#     "011": {
#         "_key": "011",
#         "name": "Trời đông, bụng đói",
#         "father": "003",
#         "sortList": []
#     },
#     "012": {
#         "_key": "012",
#         "name": "Đầu trần chân đất",
#         "father": "003",
#         "sortList": []
#     },
#     "013": {
#         "_key": "013",
#         "name": "Phố: sực nức mùi ngỗng quay",
#         "father": "003",
#         "sortList": []
#     },
#     "014": {
#         "_key": "014",
#         "name": "Diêm tắt, sợ cha mắng",
#         "father": "004",
#         "sortList": []
#     },
#     "015": {
#         "_key": "015",
#         "name": "Bức tường dày lạnh",
#         "father": "004",
#         "sortList": []
#     },
#     "016": {
#         "_key": "016",
#         "name": "Ngọn nến bay thành sao trên trời",
#         "father": "004",
#         "sortList": []
#     },
#     "017": {
#         "_key": "017",
#         "name": "Ảo ảnh biến mất",
#         "father": "004",
#         "sortList": []
#     },
#     "018": {
#         "_key": "018",
#         "name": "Chết vì đói và rét",
#         "father": "004",
#         "sortList": []
#     },
#     "019": {
#         "_key": "019",
#         "name": "Có lò sưởi",
#         "father": "005",
#         "sortList": []
#     },
#     "020": {
#         "_key": "020",
#         "name": "Có bàn ăn, ngỗng quay",
#         "father": "005",
#         "sortList": []
#     },
#     "021": {
#         "_key": "021",
#         "name": "Có cây thông nô-en",
#         "father": "005",
#         "sortList": []
#     },
#     "022": {
#         "_key": "022",
#         "name": "Có bà âu yếm",
#         "father": "005",
#         "sortList": []
#     },
#     "023": {
#         "_key": "023",
#         "name": "Hai bà cháu bay lên trời",
#         "father": "005",
#         "sortList": []
#     }
# }


sys.stdout.write(json.dumps(new_s, indent = 4))
final_json = ''