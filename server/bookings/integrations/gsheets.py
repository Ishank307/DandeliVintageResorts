import gspread
from google.oauth2.service_account import Credentials

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SERVICE_ACCOUNT_FILE = "keys.json"
SPREADSHEET_ID = "1N6DEX3PQMlr7_xiylD2Xoml19IoVE-kub4Yj4x9typE"

_creds = Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE,
    scopes=SCOPES
)

_client = gspread.authorize(_creds)


def append_booking_row(values, sheet_name="Sheet2"):
    sheet = _client.open_by_key(SPREADSHEET_ID).worksheet(sheet_name)
    sheet.append_row(values, value_input_option="USER_ENTERED")
