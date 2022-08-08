import React, { useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import UpdateUser from "./UpdateUser";
import { useUserContext } from "../../context/UserContext";
import TakenOffers from "./TakenOffers";
import GivenOffers from "./GivenOffers";
import ProfileMain from "./ProfileMain";

function Profile() {
  return (
    <div className="grid grid-cols-10 w-11/12 m-auto">
      <div className="col-span-2 py-10 pr-5">
        <div className="bg-white  rounded-lg flex flex-col shadow-item ">
          <NavLink
            to={"givenOffers"}
            className="px-2  rounded py-2 border-b-2 "
          >
            Verdiğim Teklifler
          </NavLink>
          <NavLink
            to={"takenOffers"}
            className="px-2  rounded py-2 border-b-2 "
          >
            Aldığım Teklifler
          </NavLink>
          <NavLink
            to={"changePassword"}
            className="px-2  rounded py-2 border-b-2  "
          >
            Şifre Değiştir
          </NavLink>
          <NavLink to={"updateUser"} className="px-2 rounded py-2 border-b-2 ">
            Bilgileri Değiştir
          </NavLink>
        </div>
      </div>
      <div className="col-span-8 py-10 pl-5">
        <Routes>
          <Route path="/" element={<ProfileMain />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/updateUser" element={<UpdateUser />} />
          <Route path="/takenOffers" element={<TakenOffers />} />
          <Route path="/givenOffers" element={<GivenOffers />} />
        </Routes>
      </div>
    </div>
  );
}

export default Profile;
