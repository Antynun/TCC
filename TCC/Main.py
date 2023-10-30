import requests
from bs4 import BeautifulSoup
import pandas as pd
import datetime
import os
import tqdm

def scrape_category(category_url, page):
    # Modify the URL to include the page number
    url = f"{category_url}&page={page}"

    # Make the HTTP request
    response = requests.get(url)

    # Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all the products in the category
    products = soup.find_all('div', {'data-component-type': 's-search-result'})

    # Extract the name and price for each product
    names = []
    prices = []
    for product in products:
        name = product.find('h2').text.strip()
        price = product.find('span', {'class': 'a-price-whole'})
        if price is not None:
            price = price.text.strip()
        
        # Remove commas from the name
        name = name.replace(',', '')

        names.append(name)
        prices.append(price)

    # Create a DataFrame with the data
    df = pd.DataFrame({'name': names, 'price': prices})

    return df

def main():
    # Define the categories to scrape
    categories = {
        'notebooks': 'https://www.amazon.com.br/s?rh=n%3A17923699011&fs=true&ref=lp_17923699011_sar',
        'computadores': 'https://www.amazon.com.br/s?rh=n%3A17923695011&fs=true&ref=lp_17923695011_sar',
        'monitores': 'https://www.amazon.com.br/s?rh=n%3A17923704011&fs=true&ref=lp_17923704011_sar',
        'fones': 'https://www.amazon.com.br/s?bbn=7791985011&rh=n%3A16253414011&fs=true&ref=lp_16253414011_sar',
        'mouses': 'https://www.amazon.com.br/b?node=16253417011&ref=s9_acss_bw_cg_BRPCG_3a1_w',
        'teclados': 'https://www.amazon.com.br/s?rh=n%3A16253419011&fs=true&ref=lp_16253419011_sar',
        'pecas': 'https://www.amazon.com.br/s?rh=n%3A20930509011&fs=true&ref=lp_20930509011_sar',
    }

    # Scrape each category and concatenate the data into a single DataFrame
    dfs = []
    for category_name, category_url in categories.items():
        # Iterate over multiple pages for each category
        for page in tqdm.tqdm(range(1, 15)):
            df = scrape_category(category_url, page)
            df['category'] = category_name
            dfs.append(df)

    # Concatenate all the data into a single DataFrame
    data = pd.concat(dfs)


    # Concatenate all the data into a single DataFrame
    data = pd.concat(dfs)

    # Add a timestamp column
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    data['timestamp'] = timestamp

    # Read the existing data from the CSV file, if it exists
    if os.path.isfile('data.csv'):
        existing_data = pd.read_csv('data.csv')

        # Check for duplicates and drop them from the new data
        data = data[~data.duplicated(subset=['name', 'price', 'category'], keep='last')]

        # Append the new data to the existing data
        data = pd.concat([existing_data, data], ignore_index=True)

    # Save the data to a CSV file
    data.to_csv('data.csv', index=False)


if __name__ == '__main__':
    main()


