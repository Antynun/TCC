# TCC

This Python program scrapes product information from Amazon using BeautifulSoup and saves it to a CSV file. Additionally, it includes a JavaScript component that visualizes the scraped data using Google Charts.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Antynun/TCC
    ```

2. Install the required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

3. Ensure you have the necessary permissions to run JavaScript files in your environment.

## Usage

### Python Script

1. Open `main.py`.
2. Modify the `categories` dictionary to include the categories you want to scrape and their corresponding URLs.
3. Run the Python script:

    ```bash
    python main.py
    ```

    The script will scrape product data from Amazon and save it to `data.csv`.

### JavaScript Visualization

1. Open `index.html` in a web browser.
2. Enter your search term in the search bar and click "Buscar".
3. The page will display line charts for each product matching the search term, showing the total price over time.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
