import sys
import json
import string

# print("Preparing Search For: " + sys.argv[1])

import numpy as np
import pandas as pd

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.cluster import KMeans

from gensim.models import Word2Vec

from sklearn.decomposition import PCA

import pinecone

from dotenv import load_dotenv
import os

# ---------------------------------------------
#               IMPORT DATA
# ---------------------------------------------

# constants
PATH = 'C:/Users/Thomas/Desktop/Projects/FinAI/finai/src/pages/api/pinecone/data/tweets.json'
sw = stopwords.words('english')

with open(PATH, encoding='utf-8') as f:
    data = json.load(f)

    # extract tweets and labels
    tweets = [d['text'] for d in data]
    labels = [d['label'] for d in data]

    print("Tweets: " + str(len(tweets)))
    print("Labels: " + str(len(labels)))

    # remove stop words from tweets
    vectorizer = CountVectorizer(stop_words=sw)
    X = vectorizer.fit_transform(tweets)

    print("Vectorized tweets.")

    # apply k-means clustering
    k = len(set(labels)) # set number of clusters to the number of unique labels
    kmeans = KMeans(n_clusters=k, random_state=0).fit(X)

    print("Applied k means.")

    # get the labels for each tweet
    tweet_labels = kmeans.labels_
    print("Tweet labels: " + str(len(tweet_labels)))

    print("Processed labels.")

# ---------------------------------------------
#            PRE-PROCESS AND EMBED
# ---------------------------------------------

# remove punctuations from each tweet
# tweets = [t.translate(str.maketrans('', '', string.punctuation)) for t in tweets]

tokenized_tweets = [word_tokenize(tweet.lower()) for tweet in set(tweets)]
w2v_model = Word2Vec(tokenized_tweets, min_count=3, sg=1, window=7)

print("Applied World2Vec model.")

valid_tweet_indices = [i for i, tweet in enumerate(tokenized_tweets) if any(word in w2v_model.wv.key_to_index for word in tweet)]
print("Created valid tweet indices from tokenized tweets.")

valid_tweet_indices = [i for i in valid_tweet_indices if i < len(w2v_model.wv.vectors)]
print("Removed tweet indices less than the length of W2V vectors.")

valid_word_vectors = w2v_model.wv.vectors[valid_tweet_indices]
print("Created valid word vectors.")

valid_tweets = [tweets[i] for i in valid_tweet_indices]
print("Created valid tweets.")

emb_df = pd.DataFrame(valid_word_vectors, index=valid_tweets)

print("Word Vectors: " + str(len(valid_word_vectors)))

# use PCA to reduce dimensionality of word vectors to 2
pca = PCA(n_components=2, random_state=7)
pca_word_vectors = pca.fit_transform(valid_word_vectors)

print("PCA WV: " + str(len(pca_word_vectors)))

# create DataFrame with word vectors and their corresponding labels
words_df = pd.DataFrame(pca_word_vectors, index=[valid_tweets[i] for i in range(len(valid_tweet_indices))], columns=['x', 'y'])
words_df['label'] = tweet_labels[valid_tweet_indices]

# ---------------------------------------------
#               RETURN DATA
# ---------------------------------------------

# ---------------------------------------------
#               CREATE GRAPH
# ---------------------------------------------

# get the unique labels
unique_labels = set(tweet_labels)

# create dictionary of color codes for each label
colors = plt.cm.Spectral(np.linspace(0, 1, len(unique_labels)))
color_dict = {label: color for label, color in zip(unique_labels, colors)}

label_dict = {
    0: ("#1f77b4", "Analyst Update"),
    1: ("#ff7f0e", "Fed | Central Banks"),
    2: ("#2ca02c", "Company | Product News"),
    3: ("#d62728", "Treasuries | Corporate Debt"),
    4: ("#9467bd", "Dividend"),
    5: ("#8c564b", "Earnings"),
    6: ("#e377c2", "Energy | Oil"),
    7: ("#7f7f7f", "Financials"),
    8: ("#bcbd22", "Currencies"),
    9: ("#17becf", "General News | Opinion"),
    10: ("#7f0000", "Gold | Metals | Materials"),
    11: ("#aaffc3", "IPO"),
    12: ("#ff9de4", "Legal | Regulation"),
    13: ("#c7c7c7", "M&A | Investments"),
    14: ("#1f77b4", "Macro"),
    15: ("#ffbb78", "Markets"),
    16: ("#bcbd22", "Politics"),
    17: ("#f7b6d2", "Personnel Change"),
    18: ("#ff9896", "Stock Commentary"),
    19: ("#98df8a", "Stock Movement")
}

print("Created labels.")

# create scatter plot
fig, ax = plt.subplots(figsize=(12,8))
for label in unique_labels:
    label_words_df = words_df[words_df['label'] == label]
    plt.scatter(label_words_df['x'], label_words_df['y'], color=color_dict[label], s=20, alpha=0.5)

# Create key table
ax.set_title('Word Clusters by Label')
ax.set_xlabel('PCA-1')
ax.set_ylabel('PCA-2')
handles = [mpatches.Patch(color=color_dict[label], label=label_dict[label][1]) for label in unique_labels]

# Positioning
fig.subplots_adjust(left=0.15, right=0.8, bottom=0.15, top=0.85)
plt.legend(handles=handles, title="Labels", bbox_to_anchor=(1.00, 1), loc='upper left')


plt.title('Word Clusters by Label')
plt.xlabel('PCA-1')
plt.ylabel('PCA-2')
# plt.savefig('C:/Users/Thomas/Desktop/Projects/FinAI/finai/process_data/word_clusters.png')
plt.show()

# # ---------------------------------------------
# #            PINECONE UPSERTING
# # ---------------------------------------------

# # Begin upserting the vectorized data into financial-news

# # Load environmental variables
# load_dotenv()
# token = os.environ.get("PINECONE_API_KEY")
# environment = os.environ.get("PINECONE_ENVIRONMENT")

# # Init pinecone
# pinecone.init(api_key=token, environment=environment)

# print("Connected to Pinecone.")

# index_description = pinecone.describe_index("financial-news")

# print("Reading:")
# print(str(index_description.name))

# indexName = index_description.name
# index = pinecone.Index("financial-news")

# print("Connected to index.")

# # Structure required to upsert vectors
# # 
# # vectors = [...]
# # {'id': "vec1", "values":[0.1, 0.2, 0.3, 0.4], "metadata": {'genre': 'drama'}}
# # 
# # { 
# # 'id': 'vec1', 
# # 'values': valueCreated, 
# # 'metadata': 
# #   {
# #     'label':'labelName'
# #   } 
# # }
# # 

# vectorList = []

# # Loop through each vector and create a JSON object for it
# for i, vec in enumerate(valid_word_vectors):
    
#     labelNumber = i % (len(label_dict) - 1)  
    
#     json_obj = {
#         'id': f'vec{i+1}',
#         'values': vec.tolist(),
#         'metadata': {
#             'label': label_dict[labelNumber][1]
#         }
#     }
    
#     vectorList.append(json_obj)
    
# print("Done inserting data.")

# # Split the list of JSON objects into batches of 1000
# json_str = json.dumps(vectorList)
# batch_size = 1000
# batches = [vectorList[i:i+batch_size] for i in range(0, len(vectorList), batch_size)]

# print("Inserting in batches...")

# # Upsert each batch to Pinecone
# for batch in batches:
#     upsert_response = index.upsert(
#         vectors=batch,
#         namespace=indexName
#     )

# print("Upserted Data. Response:")
# print(str(upsert_response))