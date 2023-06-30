import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookmarkedDays from './bookmark';


const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        console.log(process.env.API_KEY);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/forecast.json?key=${process.env.REACT_APP_API_KEY}&q=Targu-Jiu&days=4`
        );
        setForecast(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Nu vrea frate APIu asta...', error);
      }
    };

    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
      if (storedBookmarks) {
        setBookmarks(storedBookmarks);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks, loading]);

  const addToBookmarks = day => {
    if (!bookmarks.includes(day)) {
      const updatedBookmarks = [...bookmarks, day];
      setBookmarks(updatedBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  const removeFromBookmarks = day => {
    const updatedBookmarks = bookmarks.filter(item => item !== day);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const isBookmarked = day => {
    return bookmarks.includes(day);
  };

  if (loading) {
    return <div>Loading weather data...</div>;
  }

  if (!forecast) {
    return <div>No weather data available.</div>;
  }

  const {
    location,
    forecast: { forecastday },
  } = forecast;
  const nextThreeDays = forecastday.slice(1, 4);

  const togglePanel = day => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">
        Prognoza meteo și șansa de grătar în {location.name}
      </h2>
      <div className="row">
        <div
          className={`col-12 mb-4 ${
            expandedDay === forecastday[0].date ? 'expanded' : ''
          } cursor-pointer`}
          onClick={() => togglePanel(forecastday[0].date)}
        >
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{forecastday[0].date}</h5>
              <p className="card-text">
                Temperatura medie: {forecastday[0].day.avgtemp_c}°C
              </p>
              <p className="card-text">
                Șansa de grătar reușit:{' '}
                {100 - forecastday[0].day.daily_chance_of_rain}%
              </p>
            </div>
          </div>
        </div>
        {nextThreeDays.map(day => (
          <div
            className={`col-md-4 mb-4 ${
              expandedDay === day.date ? 'expanded' : ''
            } cursor-pointer`}
            key={day.date}
            onClick={() => togglePanel(day.date)}
          >
            <div className="card">
              <div className="card-body">
                {expandedDay === day.date ? (
                  <>
                    <h5 className="card-title">{day.date}</h5>
                    <p className="card-text">
                      Average temperature: {day.day.avgtemp_c}°C
                    </p>
                    <p className="card-text">
                      Șansa de un grătar reușit:{' '}
                      {100 - day.day.daily_chance_of_rain}%
                    </p>
                    {!isBookmarked(day.date) && (
                      <button
                        className="btn btn-primary"
                        onClick={() => addToBookmarks(day.date)}
                      >
                        Adaugă la preferințe
                      </button>
                    )}
                    {isBookmarked(day.date) && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => removeFromBookmarks(day.date)}
                      >
                        Elimină din preferințe
                      </button>
                    )}
                  </>
                ) : (
                  <h5 className="card-title">{day.date}</h5>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {bookmarks.length > 0 && <BookmarkedDays bookmarks={bookmarks} />}
    </div>
  );
};

export default Weather;
