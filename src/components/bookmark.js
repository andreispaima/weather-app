import React from 'react';


const BookmarkedDays = ({ bookmarks }) => {
  return (
    <div className="container fixed-bottom p-3 bg-light">
      <h4>Zile programate pentru gratar:</h4>
      <ul className="list-group grid flex-row">
        {bookmarks.map((day, index) => (
          <li className={`list-group-item col-${12 / Math.min(bookmarks.length, 3)}`} key={index}>
            {day}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookmarkedDays;
