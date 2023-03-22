/* eslint-disable jsx-a11y/label-has-associated-control */
import { CustomInput, CustomMobileInput } from "@/components/formik";
import { Field, useFormikContext } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";

const ShippingForm = ({ onChangeCity = () => {} }) => {
  const { values } = useFormikContext();
  const pakistanCities = [
    "Islamabad",
    "Ahmed Nager",
    "Ahmadpur East",
    "Ali Khan",
    "Alipur",
    "Arifwala",
    "Attock",
    "Bhera",
    "Bhalwal",
    "Bahawalnagar",
    "Bahawalpur",
    "Bhakkar",
    "Burewala",
    "Chillianwala",
    "Chakwal",
    "Chichawatni",
    "Chiniot",
    "Chishtian",
    "Daska",
    "Darya Khan",
    "Dera Ghazi",
    "Dhaular",
    "Dina",
    "Dinga",
    "Dipalpur",
    "Faisalabad",
    "Fateh Jhang",
    "Ghakhar Mandi",
    "Gojra",
    "Gujranwala",
    "Gujrat",
    "Gujar Khan",
    "Hafizabad",
    "Haroonabad",
    "Hasilpur",
    "Haveli",
    "Lakha",
    "Jalalpur",
    "Jattan",
    "Jampur",
    "Jaranwala",
    "Jhang",
    "Jhelum",
    "Kalabagh",
    "Karor Lal",
    "Kasur",
    "Kamalia",
    "Kamoke",
    "Khanewal",
    "Khanpur",
    "Kharian",
    "Khushab",
    "Kot Adu",
    "Jauharabad",
    "Lahore",
    "Lalamusa",
    "Layyah",
    "Liaquat Pur",
    "Lodhran",
    "Malakwal",
    "Mamoori",
    "Mailsi",
    "Mandi Bahauddin",
    "mian Channu",
    "Mianwali",
    "Multan",
    "Murree",
    "Muridke",
    "Mianwali Bangla",
    "Muzaffargarh",
    "Narowal",
    "Okara",
    "Renala Khurd",
    "Pakpattan",
    "Pattoki",
    "Pir Mahal",
    "Qaimpur",
    "Qila Didar",
    "Rabwah",
    "Raiwind",
    "Rajanpur",
    "Rahim Yar",
    "Rawalpindi",
    "Sadiqabad",
    "Safdarabad",
    "Sahiwal",
    "Sangla Hill",
    "Sarai Alamgir",
    "Sargodha",
    "Shakargarh",
    "Sheikhupura",
    "Sialkot",
    "Sohawa",
    "Soianwala",
    "Siranwali",
    "Talagang",
    "Taxila",
    "Toba Tek",
    "Vehari",
    "Wah Cantonment",
    "Wazirabad",
    "Badin",
    "Bhirkan",
    "Rajo Khanani",
    "Chak",
    "Dadu",
    "Digri",
    "Diplo",
    "Dokri",
    "Ghotki",
    "Haala",
    "Hyderabad",
    "Islamkot",
    "Jacobabad",
    "Jamshoro",
    "Jungshahi",
    "Kandhkot",
    "Kandiaro",
    "Karachi",
    "Kashmore",
    "Keti Bandar",
    "Khairpur",
    "Kotri",
    "Larkana",
    "Matiari",
    "Mehar",
    "Mirpur Khas",
    "Mithani",
    "Mithi",
    "Mehrabpur",
    "Moro",
    "Nagarparkar",
    "Naudero",
    "Naushahro Feroze",
    "Naushara",
    "Nawabshah",
    "Nazimabad",
    "Qambar",
    "Qasimabad",
    "Ranipur",
    "Ratodero",
    "Rohri",
    "Sakrand",
    "Sanghar",
    "Shahbandar",
    "Shahdadkot",
    "Shahdadpur",
    "Shahpur Chakar",
    "Shikarpaur",
    "Sukkur",
    "Tangwani",
    "Tando Adam",
    "Tando Allahyar",
    "Tando Muhammad",
    "Thatta",
    "Umerkot",
    "Warah",
    "Abbottabad",
    "Adezai",
    "Alpuri",
    "Akora Khattak",
    "Ayubia",
    "Banda Daud",
    "Bannu",
    "Batkhela",
    "Battagram",
    "Birote",
    "Chakdara",
    "Charsadda",
    "Chitral",
    "Daggar",
    "Dargai",
    "Darya Khan",
    "dera Ismail",
    "Doaba",
    "Dir",
    "Drosh",
    "Hangu",
    "Haripur",
    "Karak",
    "Kohat",
    "Kulachi",
    "Lakki Marwat",
    "Latamber",
    "Madyan",
    "Mansehra",
    "Mardan",
    "Mastuj",
    "Mingora",
    "Nowshera",
    "Paharpur",
    "Pabbi",
    "Peshawar",
    "Saidu Sharif",
    "Shorkot",
    "Shewa Adda",
    "Swabi",
    "Swat",
    "Tangi",
    "Tank",
    "Thall",
    "Timergara",
    "Tordher",
    "Awaran",
    "Barkhan",
    "Chagai",
    "Dera Bugti",
    "Gwadar",
    "Harnai",
    "Jafarabad",
    "Jhal Magsi",
    "Kacchi",
    "Kalat",
    "Kech",
    "Kharan",
    "Khuzdar",
    "Killa Abdullah",
    "Killa Saifullah",
    "Kohlu",
    "Lasbela",
    "Lehri",
    "Loralai",
    "Mastung",
    "Musakhel",
    "Nasirabad",
    "Nushki",
    "Panjgur",
    "Pishin valley",
    "Quetta",
    "Sherani",
    "Sibi",
    "Sohbatpur",
    "Washuk",
    "Zhob",
    "Ziarat",
  ];
  const cityObjects = pakistanCities.map((c) => ({ label: c, value: c }));
  return (
    <div className="checkout-shipping-wrapper">
      <div className="checkout-shipping-form">
        <div className="d-block checkout-field">
          <CustomMobileInput name="mobile" defaultValue={values.mobile} />
        </div>
        <div className="d-block checkout-field">
          <Field
            name="email"
            type="email"
            label="* Email Address"
            placeholder="Enter your email address"
            component={CustomInput}
          />
        </div>
        <div className="d-block checkout-field">
          <Field
            name="fullname"
            type="text"
            label="* Full Name"
            placeholder="Enter your full name"
            component={CustomInput}
            style={{ textTransform: "capitalize" }}
          />
        </div>
        <div className="d-block checkout-field">
          <Field
            name="address"
            type="text"
            label="* Your Address"
            placeholder="Enter your full address"
            component={CustomInput}
          />
        </div>
        <div className="d-block checkout-field">
          <span className="text-subtle">* City</span>
          <Select
            name="city"
            placeholder="--Select City--"
            options={cityObjects}
            defaultValue={values.city}
            onChange={onChangeCity}
          />
        </div>
        {/*}<div className="checkout-fieldset">
          <Field name="isInternational">
            {({ field, form, meta }) => (
              <div className="checkout-field">
                {meta.touched && meta.error ? (
                  <span className="label-input label-error">{meta.error}</span>
                ) : (
                  // eslint-disable-next-line jsx-a11y/label-has-associated-control
                  <label
                    className="label-input"
                    htmlFor={field.name}
                  >
                    Shipping Option
                  </label>
                )}
                <div className="checkout-checkbox-field">
                  <input
                    checked={field.value}
                    id={field.name}
                    onChange={(e) => {
                      form.setValues({ ...form.values, [field.name]: e.target.checked });
                    }}
                    value={meta.value}
                    type="checkbox"
                  />
                  <label className="d-flex w-100" htmlFor={field.name}>
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; International Shipping &nbsp;
                      <span className="text-subtle">7-14 days</span>
                    </h5>
                    <h4 className="margin-0">$50.00</h4>
                  </label>
                </div>
              </div>
            )}
          </Field>
        </div>
                  {*/}
      </div>
    </div>
  );
};

export default ShippingForm;
