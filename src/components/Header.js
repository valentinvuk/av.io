import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const Header = ({
  startCity,
  destCity,
  startDate,
  endDate,
  setStartCity,
  setDestCity,
  setStartDate,
  setEndDate,
  searchHandler,
}) => {
  return (
    <div className="py-5 fixed top-0 left-0 bg-yellow-300 w-full flex justify-center items-center">
      <h1 className="font-bold text-2xl mr-5">Av.ion</h1>
      <h2 className="font-bold mr-2">From:</h2>
      <input
        id="startCity"
        placeholder={startCity}
        type="text"
        className="capitalize shadow-xl h-10 rounded-md outline-none pl-5"
        size="20"
        onChange={(e) => setStartCity(e.target.value)}
      />
      <h2 className="ml-5 font-bold mr-2">To:</h2>
      <input
        placeholder={destCity}
        id="destCity"
        type="text"
        className="capitalize shadow-xl h-10 rounded-md outline-none pl-5"
        size="20"
        onChange={(e) => setDestCity(e.target.value)}
      />
      <DatePicker
        className="shadow-xl ml-5 rounded-md pl-5 h-10"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        isClearable
        placeholderText="Start date"
      />
      <DatePicker
        className="shadow-xl ml-5 rounded-md pl-5 h-10"
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        isClearable
        placeholderText="End date"
      />
      <button
        className="ml-5 hover:bg-blue-600 hover:text-white bg-white rounded-md py-2 px-3 shadow-xl"
        onClick={() => searchHandler()}
      >
        Search
      </button>
    </div>
  );
};

export default Header;
