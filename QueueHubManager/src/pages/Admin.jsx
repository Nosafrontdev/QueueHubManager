import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import CentralScreen from "../components/CentralScreen";
import AdsManager from "../components/AdsManager";


export default function Admin() {
  return (
    <>
    <Navbar />
    <CentralScreen />
   <AdsManager />
    </>
  );
}
