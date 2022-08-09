import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useColorContext } from "../../../context/ColorContext";
import {
  deleteColor,
  getColors,
  postColor,
  updateColor,
} from "../../../services/colorService";
import { toast } from "react-toastify";
import { ControlSchema } from "../../../validations/controlSchema";
import { UseUsingStateContext } from "../../../context/UsingStateContext";
import {
  deleteUsingState,
  getUsingStates,
  updateUsingState,
  updateUsingStates,
} from "../../../services/usingStateService";

function ControlUsingStates() {
  const {
    usingStates,
    setUsingStates,
    selectedUsingState,
    setSelectedUsingState,
    updateUsingStateStatus,
    setUpdateUsingStateStatus,
  } = UseUsingStateContext();
  useEffect(() => {
    getUsingStates().then((result) => setUsingStates(result.data));
    setUpdateUsingStateStatus(false);
  }, []);

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    useFormik({
      initialValues: {
        name: "",
      },
      onSubmit: (values) => {
        if (!updateUsingStateStatus) {
          postColor(values)
            .then((response) => {
              if (response.success) {
                toast.success(response.message);
                getUsingStates().then((result) => setUsingStates(result.data));
                values.name = "";
              }
            })
            .catch((err) => console.log(err));
        } else {
          const data = {
            usingStateId: selectedUsingState.usingStateId,
            name: values.name,
          };
          updateUsingState(data)
            .then((response) => {
              if (response.success) {
                toast.success(response.message);
                getUsingStates().then((result) => setUsingStates(result.data));
                values.name = "";
              }
            })
            .catch((err) => console.log(err));
        }
      },
      validationSchema: ControlSchema,
    });

  const handleDeleteUsingState = (usingStateId, usingStateName) => {
    const usingStateToDelete = {
      usingStateId: usingStateId,
      name: usingStateName,
    };
    deleteUsingState(usingStateToDelete)
      .then((response) => {
        if (response.success) {
          toast.success(response.message);
          getUsingStates().then((result) => setUsingStates(result.data));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateUsingState = (usingStateId, usingStateName) => {
    if (!updateUsingStateStatus) {
      values.name = usingStateName;
    } else {
      values.name = "";
    }
    setUpdateUsingStateStatus(!updateUsingStateStatus);
    const usingState = {
      usingStateId: usingStateId,
      name: usingStateName,
    };
    setSelectedUsingState(usingState);
  };

  return (
    <div className="flex justify-between items-center p-16">
      <div className="w-1/3  mx-auto  bg-white rounded-md shadow-item px-4 py-5">
        <div className="flex flex-col gap-2">
          {usingStates.map((usingState) => (
            <div
              className="py-2 px-3 bg-gold text-black rounded text-center flex justify-between items-center"
              key={usingState.usingStateId}
            >
              <div>{usingState.name}</div>
              <div className="flex">
                {updateUsingStateStatus ? (
                  <div
                    className="bg-indigo-500 text-white px-2 flex items-center justify-center rounded cursor-pointer mr-2"
                    onClick={() =>
                      handleUpdateUsingState(
                        usingState.usingStateId,
                        usingState.name
                      )
                    }
                  >
                    Düzenlemeyi Sonlandır
                  </div>
                ) : (
                  <div
                    className="bg-lime-500 text-white px-2 flex items-center justify-center rounded cursor-pointer mr-2"
                    onClick={() =>
                      handleUpdateUsingState(
                        usingState.usingStateId,
                        usingState.name
                      )
                    }
                  >
                    Düzenle
                  </div>
                )}

                <div
                  className="bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded cursor-pointer"
                  onClick={() =>
                    handleDeleteUsingState(
                      usingState.usingStateId,
                      usingState.name
                    )
                  }
                >
                  &#215;
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/2 mx-auto  py-10 shadow-item  bg-white">
        <div className="w-3/4 m-auto">
          <h1 className="font-extrabold text-3xl text-black mb-5 text-center">
            {updateUsingStateStatus
              ? "Kullanım Durumu Güncelle"
              : "Kullanım Durumu Ekle"}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="w-full flex  flex-col bg-darkBlue text-gray-100  px-14 py-14 text-lg">
              <input
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                name="name"
                type="text"
                className="text-darkBlue py-2 px-4 w-full"
                placeholder="Kullanım Durumu"
                required
              />
              {errors.name && touched.name && (
                <div className="text-red-400 my-2 text-sm">{errors.name}</div>
              )}
            </div>
            <div className="text-right mt-5">
              {updateUsingStateStatus ? (
                <button type="submit" className="btn  text-lg">
                  Güncelle
                </button>
              ) : (
                <button type="submit" className="btn text-lg">
                  Ekle
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ControlUsingStates;
