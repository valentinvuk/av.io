import React, { useEffect, useState } from "react";
import depart from "./../departures.png";
import arrival from "./../arrival.png";
import picload from "./../loading.gif";
import tick from "./../tick.png";

const Flights = ({
  avgPrice,
  cart,
  flights,
  dest,
  from,
  loading,
  addToCart,
}) => {
  const [letovi, setLetovi] = useState({});
  const [fromC, setFromC] = useState();
  const [destC, setDestC] = useState();

  useEffect(() => {
    setFromC(from);
    setDestC(dest);
    setLetovi(flights);
  }, [flights]);

  return (
    <div
      id="flightList"
      className="my-10 bg-yellow-200  px-5 py-5 flex flex-col mx-5 rounded-md"
    >
      <h1 className="text-4xl font-bold mb-10">Flights found: </h1>
      {letovi && !loading ? (
        letovi.data.map((flight) => {
          console.log();
          return (
            <div
              key={flight.id}
              className="shadow-sm my-1 px-5 py-5 flex items-center justify-between w-full rounded-md bg-white "
            >
              <h2 className="flex justify-center w-1/5">
                <img src={depart} alt="depart" className="h-8 ml-3 mr-2"></img>
                <b className="capitalize">{fromC + "  "} </b>
                <img
                  src={arrival}
                  alt="arrival"
                  className="h-8 ml-3 mr-2"
                ></img>
                <b className="capitalize">{destC}</b>
              </h2>
              <div className="w-1/5 flex justify-center">
                Duration: <b>{flight.itineraries[0].duration.slice(2, 7)}</b>
              </div>
              <h2 className="w-1/5 flex justify-center">
                Seats left: <b>{flight.numberOfBookableSeats}</b>
              </h2>
              <div className="w-2/5 flex justify-end items-center">
                <h2>
                  Price: <b>{flight.price.grandTotal}</b>
                  {" " + flight.price.currency}
                </h2>
                {parseInt(flight.price.grandTotal) < parseInt(avgPrice) ? (
                  <img src={tick} alt="good price" className="mx-2 h-4"></img>
                ) : (
                  ""
                )}
                <div
                  onClick={() => {
                    addToCart([
                      ...cart,
                      { ...flight, from: fromC, dest: destC },
                    ]);
                  }}
                  className="cursor-pointer hover:bg-blue-500 text-white ml-5 px-2 py-1 bg-blue-900 rounded-md"
                >
                  Reserve now
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="mt-5 flex text-black w-full justify-center">
          <img src={picload} alt="loading" className="h-16"></img>
        </div>
      )}
    </div>
  );
};

export default Flights;
