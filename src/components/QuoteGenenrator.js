import React, { useState, useEffect } from "react";
import { Typography, message } from "antd";

const { Text } = Typography;

const QuoteGenerator = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  const generateQuote = async () => {
    try {
      const response = await fetch(
        "https://api.quotable.io/quotes?limit=1000000"
      );

      if (!response.ok) {
        console.error("Error fetching quotes. Status:", response.status);
        const data = await response.json();
        console.error("Error message:", data.message);
        return;
      }

      const data = await response.json();
      const filteredQuotes = data.results.filter((quote) =>
        selectedTag ? quote.tags.includes(selectedTag) : true
      );

      if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const selectedQuote = filteredQuotes[randomIndex];

        setQuote(selectedQuote.content);
        setAuthor(selectedQuote.author);
      } else {
        message.warning("No quotes available for the selected tag");
      }
    } catch (error) {
      console.error("Error fetching quotes:", error.message);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("https://api.quotable.io/tags");
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error.message);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag("");
    } else {
      setSelectedTag(tag);
    }
  };

  const handleAllTagsClick = () => {
    setSelectedTag("");
  };

  return (
    <div className="quote-generator-container bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center flex-col">
        {quote && (
          <div className="quote-card bg-white p-8 rounded-lg shadow-md text-center flex items-center justify-center flex-col">
            <Text className="text-xl font-semibold italic">"{quote}"</Text>
            <Text className="text-sm italic mt-2">- {author} -</Text>
          </div>
        )}

        <div className="mt-4">
          <button
            className={`mr-2 ${
              !selectedTag ? "bg-green-500 text-white" : "bg-gray-300 text-black"
            } py-2 px-4 rounded`}
            onClick={handleAllTagsClick}
          >
            All Tags
          </button>

          {tags.map((tag) => (
            <button
              key={tag._id}
              className={`mr-2 ${
                selectedTag &&
                selectedTag.toLowerCase() === tag.name.toLowerCase()
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black"
              } p-2 m-2 rounded`}
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.name}
            </button>
          ))}
        </div>

        <button
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={generateQuote}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default QuoteGenerator;
