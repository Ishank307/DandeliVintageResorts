import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


from google.oauth2 import service_account
service_account_file = "keys.json"



creds = None
credentials = service_account.Credentials.from_service_account_file(
        service_account_file,
        scopes=["https://www.googleapis.com/auth/spreadsheets"],
    )
SAMPLE_SPREADSHEET_ID = "1N6DEX3PQMlr7_xiylD2Xoml19IoVE-kub4Yj4x9typE"



service = build("sheets", "v4", credentials=credentials)

# Call the Sheets API
sheet = service.spreadsheets()
result = (
    sheet.values()
    .get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range="SHEET1!A1:D3")
    .execute()
)


req = sheet.values().append(
    spreadsheetId=SAMPLE_SPREADSHEET_ID,
    range="SHEET2",
    valueInputOption="USER_ENTERED",
    body={"values": [["Name", "Major", "Year", "GmPA"]]},
)

req = req.execute()
print(req)
