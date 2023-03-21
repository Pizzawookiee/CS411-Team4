
from pytrends.request import TrendReq
pytrends = TrendReq(hl='en-US',tz=360)
#pytrends = TrendReq(hl='en-US', tz=360, timeout=(10,25), proxies=['https://35.201.123.31:880',], retries=2, backoff_factor=0.1, requests_args={'verify':False})

kw_list = ["Blockchain"]
pytrends.build_payload(kw_list, cat=0, timeframe='today 5-y', geo='', gprop='')



'''

import requests

url = "https://trendnxt-api.p.rapidapi.com/get_realtime_categpries"

headers = {
	"X-RapidAPI-Key": "7a91211f82mshf20f09182c556c0p1a9d69jsnb4f99bd50576",
	"X-RapidAPI-Host": "trendnxt-api.p.rapidapi.com"
}

response = requests.request("GET", url, headers=headers)

print(response.text)

'''
'''
import gtab
t = gtab.GTAB()
# Make the queries which will return precise values!
query_facebook = t.new_query("facebook")
query_swaziland = t.new_query("swaziland")
'''