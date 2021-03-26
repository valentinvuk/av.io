import React, { useEffect, useState } from "react";
import Flights from "./components/Flights";
import DatePicker from "react-datepicker";
import Header from "./components/Header";
import depart from "./departures.png";
import arrival from "./arrival.png";
import { useInView } from "react-intersection-observer";

import "react-datepicker/dist/react-datepicker.css";

let apiKey = "";
const client_id = "wu93VoF9pFlM9DblXbK034HYbaElvFjB";
const client_secret = "dbuUAmGJdkzmG32A";

const App = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [destCity, setDestCity] = useState();
  const [startCity, setStartCity] = useState();
  const [iataStart, setIataStart] = useState();
  const [iataDest, setIataDest] = useState();
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const [cart, setCart] = useState([]);
  const [cartView, setCartView] = useState(false);
  const [avgPrice, setAvgPrice] = useState(100000);
  const [auth, setAuth] = useState(false);

  useEffect(async () => {
    await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        apiKey = data.access_token;
      });
    if (iataDest) searchFlights();
  }, [iataDest]);

  const searchFlights = async () => {
    await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${iataStart}&destinationLocationCode=${iataDest}&departureDate=${startDate.getFullYear()}-${appendLeadingZeroes(
        startDate.getMonth() + 1
      )}-${appendLeadingZeroes(startDate.getDate())}&adults=1&max=10`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + apiKey,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFlightData(data);
        setLoading(false);
        fetch(
          `https://test.api.amadeus.com/v1/analytics/itinerary-price-metrics?originIataCode=${iataStart}&destinationIataCode=${iataDest}&departureDate=${startDate.getFullYear()}-${appendLeadingZeroes(
            startDate.getMonth() + 1
          )}-${appendLeadingZeroes(startDate.getDate())}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + apiKey,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            try {
              if (data.data[0].priceMetrics[2].amount)
                setAvgPrice(data.data[0].priceMetrics[2].amount);
              console.log(data.data[0].priceMetrics[2].amount);
            } catch (error) {
              console.log(error);
            }
          });
        /* .then((data) => console.log(data.data.priceMetrics[2].amount)) */
      });
  };

  const searchHandler = async () => {
    setLoading(true);
    try {
      await fetch(
        "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=" +
          startCity,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + apiKey,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setIataStart(data.data[0].iataCode))
        .then(() =>
          fetch(
            "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=" +
              destCity,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + apiKey,
              },
            }
          )
            .then((res) => res.json())
            .then((data) => {
              setIataDest(data.data[0].iataCode);
            })
        );
    } catch (error) {
      console.log(error);
    }
  };

  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }

  return (
    <div className="bg-white font-ibmsans">
      <div className="w-full bg-yellow-300 items-center flex-col justify-center">
        <div className="px-10 w-full shadow-inner bg-white flex justify-between items-center">
          <h1
            onClick={() => {
              console.log(cart);
            }}
            className="p-3 text-4xl font-bold"
          >
            Av.ion
          </h1>
          <h1
            className="hover:border-black border-b font-bold cursor-pointer"
            onClick={() => setCartView(true)}
          >
            Cart
          </h1>
        </div>
        {!cartView ? (
          <div className="py-10 flex flex-col items-center">
            <h1 className="text-5xl font-bold mb-10 ">Travel Anywhere</h1>
            <div className=" flex justify-center items-center">
              <img src={depart} alt="depart" className="h-10 mr-3" />
              <input
                placeholder={startCity}
                id="startCity"
                type="text"
                className="capitalize shadow-xl h-10 rounded-md outline-none pl-5"
                size="20"
                onChange={(e) => setStartCity(e.target.value)}
              />
              <img src={arrival} alt="arrival" className="ml-7 h-10 mr-3" />
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
            </div>
            <div className="mt-10">
              <button
                ref={ref}
                className="hover:bg-blue-600 hover:text-white bg-white rounded-md py-2 px-3 shadow-xl"
                onClick={() => searchHandler()}
              >
                Search
              </button>
            </div>
          </div>
        ) : (
          <div className="px-10 py-10 flex-col mt-16 items-center">
            <div className="mb-5 flex justify-between w-full items-center border-b-2 py-4 border-black">
              <h1 className="text-4xl font-bold">My reservations:</h1>
              <h1
                className="px-2 py-1 bg-white rounded-md cursor-pointer font-bold"
                onClick={() => setCartView(false)}
              >
                X
              </h1>
            </div>

            {cart.length > 0 ? (
              cart.map((flight, index) => {
                return (
                  <div
                    key={flight.id}
                    className="shadow-sm my-1 px-5 py-5 flex items-center justify-between w-full rounded-md bg-white "
                  >
                    <h2>
                      From: <b className="capitalize">{flight.from}</b> To:{" "}
                      <b className="capitalize">{flight.dest}</b>
                    </h2>
                    <div>
                      Duration:{" "}
                      <b>{flight.itineraries[0].duration.slice(2, 7)}</b>
                    </div>
                    <h2>Seats left: {flight.numberOfBookableSeats}</h2>
                    <div className="flex items-center">
                      <div className="flex justify-center items-center">
                        <h2>
                          Cost: <b>{flight.price.grandTotal}</b>
                          {" " + flight.price.currency}
                        </h2>
                      </div>

                      <div
                        onClick={() => {
                          alert("Bought this ticket succesfully!");
                        }}
                        className="hover:bg-blue-500 px-2 ml-5 py-1 rounded-md text-white cursor-pointer bg-blue-800"
                      >
                        Buy Now
                      </div>
                      <div
                        className="ml-5 font-bold cursor-pointer"
                        onClick={() =>
                          setCart(
                            cart.filter(
                              (reservation) => reservation.id !== flight.id
                            )
                          )
                        }
                      >
                        X
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h2 className="font-bold">It's empty :(</h2>
            )}
          </div>
        )}
      </div>
      {flightData || loading ? (
        <Flights
          avgPrice={avgPrice}
          cart={cart}
          addToCart={setCart}
          loading={loading}
          from={startCity}
          dest={destCity}
          flights={flightData}
        ></Flights>
      ) : (
        <></>
      )}
      {!inView ? (
        <Header
          startCity={startCity}
          destCity={destCity}
          startDate={startDate}
          endDate={endDate}
          setStartCity={setStartCity}
          setDestCity={setDestCity}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          searchHandler={searchHandler}
        ></Header>
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
