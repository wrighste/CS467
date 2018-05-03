'''
Created on Apr 16, 2018

@author: swright
'''
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re
from flask import Flask, url_for
from flask import request
from flask import jsonify
app = Flask(__name__)

@app.route('/')
def api_root():
    return 'Welcome'


class MyClass(object):

    def __init__(self, params):
        '''
        Constructor
        '''
     
def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200 
            and content_type is not None 
            and content_type.find('html') > -1)


def log_error(e):
    """
    It is always a good idea to log errors. 
    This function just prints them, but you can
    make it do anything.
    """
    print(e)        

@app.route('/findurl',methods=['GET','POST'])
def api_hello():
    if request.method == 'POST':
        myurl = request.form.get('url')
        dfs = request.form.get('dfs')
    else:
        myurl = "http://yahoo.com"
        dfs = "bfs"
    links = []
    results = BuildList(myurl,links,2)
     
    return jsonify(results)
        #geturls()
     

#def ReadURLOnPage(url):
def BuildList(URL,URLList,depth):
    if (depth==0):
        return URLList
    #childURLList = []
    URLList = ReadURLOnPage(URL,URLList,depth)
    for url in URLList:
         if (url.get('parenturl',None) == URL):
             URLList = ReadURLOnPage(url.get('url',None),URLList,depth-1)
    depth = depth - 1
    return URLList

def ReadURLOnPage(myurl, links,depth):
    raw_html = simple_get(myurl)
    html = BeautifulSoup(raw_html, 'html.parser')
   
    dep = int(depth)
#found code below here: https://pythonspot.com/extract-links-from-webpage-beautifulsoup/ 
    id = 0
    for link in html.findAll('a', attrs={'href': re.compile("^http://")}):
       # links.append(link.get('href'))
        foundurl = link.get('href')
        id = id + 1
        urlrecord = {"depth":depth,"id": id,"url":foundurl,"parenturl":myurl}
        
        links.append(urlrecord)
        #print(links)
        
     
    l =  len(raw_html)
    return links

if __name__ == "__main__":
    #app.run(host= '0.0.0.0') 
    app.run(host= '172.31.22.173',port=5002)