
import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";

const COUNTRIES = [
  { code: "+1", country: "United States", states: ["California", "New York", "Texas"] },
  { code: "+91", country: "India", states: ["Telangana", "Maharashtra", "Karnataka"] },
  { code: "+44", country: "United Kingdom", states: ["England", "Scotland", "Wales"] },
  // ...add more as needed
];

const CITIES = {
  California: ["Los Angeles", "San Francisco", "San Diego"],
  "New York": ["New York City", "Buffalo", "Rochester"],
  Texas: ["Houston", "Dallas", "Austin"],
  Telangana: ["Hyderabad", "Warangal"],
  Maharashtra: ["Mumbai", "Pune"],
  Karnataka: ["Bangalore", "Mysore"],
  England: ["London", "Manchester"],
  Scotland: ["Edinburgh", "Glasgow"],
  Wales: ["Cardiff", "Swansea"],
};

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();

  // Split location into country, state, city for dropdowns
  const { name, email, phone, url, summary, location } = profile;
  let country = "", state = "", city = "";
  if (location) {
    const parts = location.split(", ");
    [city, state, country] = parts.reverse();
    city = city || ""; state = state || ""; country = country || "";
  }
  const selectedCountry = COUNTRIES.find(c => c.country === country) || COUNTRIES[0];
  const selectedStates = selectedCountry.states;
  const selectedCities = (CITIES as Record<string, string[]>)[state] || [];
  const phoneCode = selectedCountry.code;


  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    const code = COUNTRIES.find(c => c.country === country)?.code || "";
    const firstState = selectedCountry.states[0];
    const firstCity = ((CITIES as Record<string, string[]>)[firstState] || [""])[0];
    handleProfileChange("location", `${firstCity}, ${firstState}, ${country}`);
  };
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    const firstCity = ((CITIES as Record<string, string[]>)[state] || [""])[0];
    handleProfileChange("location", `${firstCity}, ${state}, ${country}`);
  };
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    handleProfileChange("location", `${city}, ${state}, ${country}`);
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleProfileChange}
        />
        <Textarea
          label="Objective"
          labelClassName="col-span-full"
          name="summary"
          placeholder="Entrepreneur and educator obsessed with making education free for anyone"
          value={summary}
          onChange={handleProfileChange}
        />
        <Input
          label="Email"
          labelClassName="col-span-4"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <div className="col-span-2 flex gap-2">
          <select className="rounded border-gray-300 px-2 py-1" value={phoneCode} disabled>
            <option value={phoneCode}>{phoneCode}</option>
          </select>
          <Input
            label="Phone"
            labelClassName="!mb-0"
            name="phone"
            placeholder="(123)456-7890"
            value={phone}
            onChange={handleProfileChange}
          />
        </div>
        <Input
          label="Website"
          labelClassName="col-span-4"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        <div className="col-span-2 flex gap-2">
          <select className="rounded border-gray-300 px-2 py-1" value={country} onChange={handleCountryChange}>
            {COUNTRIES.map(c => <option key={c.country} value={c.country}>{c.country}</option>)}
          </select>
          <select className="rounded border-gray-300 px-2 py-1" value={state} onChange={handleStateChange}>
            {selectedStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="rounded border-gray-300 px-2 py-1" value={city} onChange={handleCityChange}>
            {selectedCities.map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </BaseForm>
  );
};
