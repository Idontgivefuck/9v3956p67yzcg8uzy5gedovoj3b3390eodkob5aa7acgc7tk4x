const countries = [
  {
    name: "Italia",
    dialCode: "+39",
    isoCode: "IT",
    flag: "https://cdn.kcak11.com/CountryFlags/countries/it.svg",
  },
];

const sorter = (a, b) => {
  return a.name.localeCompare(b.name);
};
countries.sort(sorter);
countries.forEach((country) => {
  country.label = `${country.name} (${country.dialCode})`;
});
export default countries;
