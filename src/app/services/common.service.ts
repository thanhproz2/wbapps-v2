import { Injectable } from "@angular/core";
import { Constants } from "../utils/constants";
import { ApiUrl } from "../utils/apiUrl";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root"
})
export class CommonService {
  constructor(
    private constants: Constants,
    private apiUrl: ApiUrl,
    private _apiService: ApiService
    ) {}

  getCountries() {
    return [
      {
        name: "--Country--",
        value: ""
      },
      {
        name: "Afghanistan",
        value: "Afghanistan"
      },
      {
        name: "Albania",
        value: "Albania"
      },
      {
        name: "Algeria",
        value: "Algeria"
      },
      {
        name: "Andorra",
        value: "Andorra"
      },
      {
        name: "Angola",
        value: "Angola"
      },
      {
        name: "Anguilla (UK)",
        value: "Anguilla (UK)"
      },
      {
        name: "Antigua and Barbuda",
        value: "Antigua and Barbuda"
      },
      {
        name: "Argentina",
        value: "Argentina"
      },
      {
        name: "Armenia",
        value: "Armenia"
      },
      {
        name: "Aruba (Netherlands)",
        value: "Aruba (Netherlands)"
      },
      {
        name: "Australia",
        value: "Australia"
      },
      {
        name: "Austria",
        value: "Austria"
      },
      {
        name: "Azerbaijan",
        value: "Azerbaijan"
      },
      {
        name: "Bahamas",
        value: "Bahamas"
      },
      {
        name: "Bahrain",
        value: "Bahrain"
      },
      {
        name: "Bangladesh",
        value: "Bangladesh"
      },
      {
        name: "Barbados",
        value: "Barbados"
      },
      {
        name: "Belarus",
        value: "Belarus"
      },
      {
        name: "Belgium",
        value: "Belgium"
      },
      {
        name: "Belize",
        value: "Belize"
      },
      {
        name: "Benin",
        value: "Benin"
      },
      {
        name: "Bhutan",
        value: "Bhutan"
      },
      {
        name: "Bolivia",
        value: "Bolivia"
      },
      {
        name: "Bosnia and Herzegovina",
        value: "Bosnia and Herzegovina"
      },
      {
        name: "Botswana",
        value: "Botswana"
      },
      {
        name: "Brazil",
        value: "Brazil"
      },
      {
        name: "British Virgin Islands (UK)",
        value: "British Virgin Islands (UK)"
      },
      {
        name: "Brunei",
        value: "Brunei"
      },
      {
        name: "Bulgaria",
        value: "Bulgaria"
      },
      {
        name: "Burkina Faso",
        value: "Burkina Faso"
      },
      {
        name: "Burundi",
        value: "Burundi"
      },
      {
        name: "Cabo Verde",
        value: "Cabo Verde"
      },
      {
        name: "Cambodia",
        value: "Cambodia"
      },
      {
        name: "Cameroon",
        value: "Cameroon"
      },
      {
        name: "Canada",
        value: "Canada"
      },
      {
        name: "Caribbean Netherlands (Netherlands)",
        value: "Caribbean Netherlands (Netherlands)"
      },
      {
        name: "Cayman Islands (UK)",
        value: "Cayman Islands (UK)"
      },
      {
        name: "Central African Republic",
        value: "Central African Republic"
      },
      {
        name: "Chad",
        value: "Chad"
      },
      {
        name: "Chile",
        value: "Chile"
      },
      {
        name: "China",
        value: "China"
      },
      {
        name: "Colombia",
        value: "Colombia"
      },
      {
        name: "Comoros",
        value: "Comoros"
      },
      {
        name: "Congo",
        value: "Congo"
      },
      {
        name: "Costa Rica",
        value: "Costa Rica"
      },
      {
        name: "Cote d'Ivoire",
        value: "Cote d'Ivoire"
      },
      {
        name: "Croatia",
        value: "Croatia"
      },
      {
        name: "Cuba",
        value: "Cuba"
      },
      {
        name: "Curaçao",
        value: "Curaçao"
      },
      {
        name: "Cyprus",
        value: "Cyprus"
      },
      {
        name: "Czech Republic",
        value: "Czech Republic"
      },
      {
        name: "Denmark",
        value: "Denmark"
      },
      {
        name: "Djibouti",
        value: "Djibouti"
      },
      {
        name: "Dominica",
        value: "Dominica"
      },
      {
        name: "Dominican Republic",
        value: "Dominican Republic"
      },
      {
        name: "Ecuador",
        value: "Ecuador"
      },
      {
        name: "Egypt",
        value: "Egypt"
      },
      {
        name: "El Salvador",
        value: "El Salvador"
      },
      {
        name: "Equatorial Guinea",
        value: "Equatorial Guinea"
      },
      {
        name: "Eritrea",
        value: "Eritrea"
      },
      {
        name: "Estonia",
        value: "Estonia"
      },
      {
        name: "Ethiopia",
        value: "Ethiopia"
      },
      {
        name: "Fiji",
        value: "Fiji"
      },
      {
        name: "Finland",
        value: "Finland"
      },
      {
        name: "France",
        value: "France"
      },
      {
        name: "Gabon",
        value: "Gabon"
      },
      {
        name: "Gambia",
        value: "Gambia"
      },
      {
        name: "Georgia",
        value: "Georgia"
      },
      {
        name: "Germany",
        value: "Germany"
      },
      {
        name: "Ghana",
        value: "Ghana"
      },
      {
        name: "Greece",
        value: "Greece"
      },
      {
        name: "Grenada",
        value: "Grenada"
      },
      {
        name: "Guadeloupe (France)",
        value: "Guadeloupe (France)"
      },
      {
        name: "Guatemala",
        value: "Guatemala"
      },
      {
        name: "Guinea",
        value: "Guinea"
      },
      {
        name: "Guinea-Bissau",
        value: "Guinea-Bissau"
      },
      {
        name: "Guyana",
        value: "Guyana"
      },
      {
        name: "Haiti",
        value: "Haiti"
      },
      {
        name: "Honduras",
        value: "Honduras"
      },
      {
        name: "Hungary",
        value: "Hungary"
      },
      {
        name: "Iceland",
        value: "Iceland"
      },
      {
        name: "India",
        value: "India"
      },
      {
        name: "Indonesia",
        value: "Indonesia"
      },
      {
        name: "Iran",
        value: "Iran"
      },
      {
        name: "Iraq",
        value: "Iraq"
      },
      {
        name: "Ireland",
        value: "Ireland"
      },
      {
        name: "Israel",
        value: "Israel"
      },
      {
        name: "Italy",
        value: "Italy"
      },
      {
        name: "Jamaica",
        value: "Jamaica"
      },
      {
        name: "Japan",
        value: "Japan"
      },
      {
        name: "Jordan",
        value: "Jordan"
      },
      {
        name: "Kazakhstan",
        value: "Kazakhstan"
      },
      {
        name: "Kenya",
        value: "Kenya"
      },
      {
        name: "Kiribati",
        value: "Kiribati"
      },
      {
        name: "Kosovo",
        value: "Kosovo"
      },
      {
        name: "Kuwait",
        value: "Kuwait"
      },
      {
        name: "Kyrgyzstan",
        value: "Kyrgyzstan"
      },
      {
        name: "Laos",
        value: "Laos"
      },
      {
        name: "Latvia",
        value: "Latvia"
      },
      {
        name: "Lebanon",
        value: "Lebanon"
      },
      {
        name: "Lesotho",
        value: "Lesotho"
      },
      {
        name: "Liberia",
        value: "Liberia"
      },
      {
        name: "Libya",
        value: "Libya"
      },
      {
        name: "Liechtenstein",
        value: "Liechtenstein"
      },
      {
        name: "Lithuania",
        value: "Lithuania"
      },
      {
        name: "Luxembourg",
        value: "Luxembourg"
      },
      {
        name: "Macedonia",
        value: "Macedonia"
      },
      {
        name: "Madagascar",
        value: "Madagascar"
      },
      {
        name: "Malawi",
        value: "Malawi"
      },
      {
        name: "Malaysia",
        value: "Malaysia"
      },
      {
        name: "Maldives",
        value: "Maldives"
      },
      {
        name: "Mali",
        value: "Mali"
      },
      {
        name: "Malta",
        value: "Malta"
      },
      {
        name: "Marshall Islands",
        value: "Marshall Islands"
      },
      {
        name: "Martinique (France)",
        value: "Martinique (France)"
      },
      {
        name: "Mauritania",
        value: "Mauritania"
      },
      {
        name: "Mauritius",
        value: "Mauritius"
      },
      {
        name: "Mexico",
        value: "Mexico"
      },
      {
        name: "Micronesia",
        value: "Micronesia"
      },
      {
        name: "Moldova",
        value: "Moldova"
      },
      {
        name: "Monaco",
        value: "Monaco"
      },
      {
        name: "Mongolia",
        value: "Mongolia"
      },
      {
        name: "Montenegro",
        value: "Montenegro"
      },
      {
        name: "Montserrat (UK)",
        value: "Montserrat (UK)"
      },
      {
        name: "Morocco",
        value: "Morocco"
      },
      {
        name: "Mozambique",
        value: "Mozambique"
      },
      {
        name: "Myanmar",
        value: "Myanmar"
      },
      {
        name: "Namibia",
        value: "Namibia"
      },
      {
        name: "Nauru",
        value: "Nauru"
      },
      {
        name: "Nepal",
        value: "Nepal"
      },
      {
        name: "Netherlands",
        value: "Netherlands"
      },
      {
        name: "New Zealand",
        value: "New Zealand"
      },
      {
        name: "Nicaragua",
        value: "Nicaragua"
      },
      {
        name: "Niger",
        value: "Niger"
      },
      {
        name: "Nigeria",
        value: "Nigeria"
      },
      {
        name: "North Korea",
        value: "North Korea"
      },
      {
        name: "Norway",
        value: "Norway"
      },
      {
        name: "Oman",
        value: "Oman"
      },
      {
        name: "Pakistan",
        value: "Pakistan"
      },
      {
        name: "Palau",
        value: "Palau"
      },
      {
        name: "Palestine",
        value: "Palestine"
      },
      {
        name: "Panama",
        value: "Panama"
      },
      {
        name: "Papua New Guinea",
        value: "Papua New Guinea"
      },
      {
        name: "Paraguay",
        value: "Paraguay"
      },
      {
        name: "Peru",
        value: "Peru"
      },
      {
        name: "Philippines",
        value: "Philippines"
      },
      {
        name: "Poland",
        value: "Poland"
      },
      {
        name: "Portugal",
        value: "Portugal"
      },
      {
        name: "Puerto Rico (US)",
        value: "Puerto Rico (US)"
      },
      {
        name: "Qatar",
        value: "Qatar"
      },
      {
        name: "Romania",
        value: "Romania"
      },
      {
        name: "Russia",
        value: "Russia"
      },
      {
        name: "Rwanda",
        value: "Rwanda"
      },
      {
        name: "Saint Barthélemy (France)",
        value: "Saint Barthélemy (France)"
      },
      {
        name: "Saint Martin (France)",
        value: "Saint Martin (France)"
      },
      {
        name: "St. Kitts and Nevis",
        value: "St. Kitts and Nevis"
      },
      {
        name: "St. Lucia",
        value: "St. Lucia"
      },
      {
        name: "St. Vincent and The Grenadines",
        value: "St. Vincent and The Grenadines"
      },
      {
        name: "Samoa",
        value: "Samoa"
      },
      {
        name: "San Marino",
        value: "San Marino"
      },
      {
        name: "Sao Tome and Principe",
        value: "Sao Tome and Principe"
      },
      {
        name: "Saudi Arabia",
        value: "Saudi Arabia"
      },
      {
        name: "Senegal",
        value: "Senegal"
      },
      {
        name: "Serbia",
        value: "Serbia"
      },
      {
        name: "Seychelles",
        value: "Seychelles"
      },
      {
        name: "Sierra Leone",
        value: "Sierra Leone"
      },
      {
        name: "Singapore",
        value: "Singapore"
      },
      {
        name: "Sint Maarten (Netherlands)",
        value: "Sint Maarten (Netherlands)"
      },
      {
        name: "Slovakia",
        value: "Slovakia"
      },
      {
        name: "Slovenia",
        value: "Slovenia"
      },
      {
        name: "Solomon Islands",
        value: "Solomon Islands"
      },
      {
        name: "Somalia",
        value: "Somalia"
      },
      {
        name: "South Africa",
        value: "South Africa"
      },
      {
        name: "South Korea",
        value: "South Korea"
      },
      {
        name: "South Sudan",
        value: "South Sudan"
      },
      {
        name: "Spain",
        value: "Spain"
      },
      {
        name: "Sri Lanka",
        value: "Sri Lanka"
      },
      {
        name: "Sudan",
        value: "Sudan"
      },
      {
        name: "Suriname",
        value: "Suriname"
      },
      {
        name: "Swaziland",
        value: "Swaziland"
      },
      {
        name: "Sweden",
        value: "Sweden"
      },
      {
        name: "Switzerland",
        value: "Switzerland"
      },
      {
        name: "Syria",
        value: "Syria"
      },
      {
        name: "Taiwan",
        value: "Taiwan"
      },
      {
        name: "Tajikistan",
        value: "Tajikistan"
      },
      {
        name: "Tanzania",
        value: "Tanzania"
      },
      {
        name: "Thailand",
        value: "Thailand"
      },
      {
        name: "Timor-Leste",
        value: "Timor-Leste"
      },
      {
        name: "Togo",
        value: "Togo"
      },
      {
        name: "Tonga",
        value: "Tonga"
      },
      {
        name: "Trinidad and Tobago",
        value: "Trinidad and Tobago"
      },
      {
        name: "Tunisia",
        value: "Tunisia"
      },
      {
        name: "Turkey",
        value: "Turkey"
      },
      {
        name: "Turkmenistan",
        value: "Turkmenistan"
      },
      {
        name: "Turks and Caicos Islands (UK)",
        value: "Turks and Caicos Islands (UK)"
      },
      {
        name: "Tuvalu",
        value: "Tuvalu"
      },
      {
        name: "Uganda",
        value: "Uganda"
      },
      {
        name: "Ukraine",
        value: "Ukraine"
      },
      {
        name: "United Arab Emirates",
        value: "United Arab Emirates"
      },
      {
        name: "United Kingdom (UK)",
        value: "United Kingdom (UK)"
      },
      {
        name: "United States Virgin Islands (US)",
        value: "United States Virgin Islands (US)"
      },
      {
        name: "United States of America (USA)",
        value: "United States"
      },
      {
        name: "Uruguay",
        value: "Uruguay"
      },
      {
        name: "Uzbekistan",
        value: "Uzbekistan"
      },
      {
        name: "Vanuatu",
        value: "Vanuatu"
      },
      {
        name: "Vatican City (Holy See)",
        value: "Vatican City (Holy See)"
      },
      {
        name: "Venezuela",
        value: "Venezuela"
      },
      {
        name: "Vietnam",
        value: "Vietnam"
      },
      {
        name: "Yemen",
        value: "Yemen"
      },
      {
        name: "Zambia",
        value: "Zambia"
      },
      {
        name: "Zimbabwe",
        value: "Zimbabwe"
      }
    ];
  }

  getMemberRoles() {
    return [
      {
        name: "Sharer/Collaborator",
        value: "sharer/collaborator"
      },
      {
        name: "Curator",
        value: "curator"
      },
      {
        name: "Reviewer",
        value: "reviewer"
      },
      {
        name: "Submitter",
        value: "submitter"
      },
      {
        name: "Production Assistant",
        value: "assistant"
      },
      {
        name: "DOP",
        value: "dop"
      },
      {
        name: "Camera Operator",
        value: "operator"
      },
      {
        name: "Editor",
        value: "editor"
      },
      {
        name: "Graphics",
        value: "graphics"
      },
      {
        name: "Audio Post",
        value: "audio"
      },
      {
        name: "Production Sound",
        value: "sound"
      },
      {
        name: "Writer/Researcher",
        value: "writer"
      },
      {
        name: "Composer",
        value: "composer"
      },
      {
        name: "Producer",
        value: "producer"
      },
      {
        name: "Director",
        value: "director"
      },
      {
        name: "Motion Graphics Artist",
        value: "motion"
      },
      {
        name: "2D Animator",
        value: "2d"
      },
      {
        name: "3D Animator",
        value: "3d"
      },
      {
        name: "Actor/Actress",
        value: "actor"
      },
      {
        name: "Model",
        value: "model"
      },
      {
        name: "MUA",
        value: "mua"
      },
      {
        name: "Audio Post Engineer",
        value: "engineer"
      },
      {
        name: "Other",
        value: "other"
      }
    ];
  }

  getListprofessionalTypes() {
    return [
      {
        value: "professional media creator",
        name:
          "PROFESSIONAL MEDIA CREATOR (I make money from my content FULL or PART TIME)"
      },
      {
        value: "media amateur",
        name:
          "MEDIA AMATEUR (This is my first effort to generate income from my content)"
      },
      {
        value: "model/actor/actress",
        name: "Model or Actor/Actress"
      },
      {
        value: "sharer/collaborator",
        name: "Sharer or Collaborator with an existing Blackbox member"
      }
    ];
  }

  getListSocialMedia() {
    return [
      {
        name: "Facebook",
        value: "facebook"
      },
      {
        name: "Instagram",
        value: "instagram"
      },
      {
        name: "Linkedin",
        value: "linkedin"
      },
      {
        name: "Vimeo",
        value: "vimeo"
      },
      {
        name: "Youtube",
        value: "youtube"
      },
      {
        name: "Skype",
        value: "skype"
      },
      {
        name: "Twitter",
        value: "twitter"
      },
      {
        name: "Flickr",
        value: "flickr"
      },
      {
        name: "Pinterest",
        value: "pinterest"
      }
    ];
  }

  getReferralSources() {
    return [
      {
        name: "--- Please select an answer ---",
        value: ""
      },
      {
        name: "BlackBox Member Referral",
        value: "blackbox"
      },
      {
        name: "Facebook",
        value: "facebook"
      },
      {
        name: "Twitter",
        value: "twitter"
      },
      {
        name: "Instagram",
        value: "instagram"
      },
      {
        name: "Indie Film Hustle Podcast",
        value: "indieFilmHustle"
      },
      {
        name: "Studio Sherpas Podcast",
        value: "studioSherpas"
      },
      {
        name: "The Documentary Life Podcast",
        value: "documentaryLife"
      },
      {
        name: "The Artful Camera Podcast",
        value: "artfulCamera"
      },
      {
        name: "The Filmmakers Process Podcast",
        value: "filmmakers"
      },
      {
        name: "Dave Bullis Podcast",
        value: "daveBullis"
      },
      {
        name: "Jeven Dovey YouTube",
        value: "JevenDoveyYouTube"
      },
      {
        name: "Chris Hau YouTube",
        value: "ChrisHauYouTube"
      },
      {
        name: "Other",
        value: "other"
      }
    ];
  }

  getPayoutMethods() {
    return [
      {
        name: "Paypal",
        value: "paypal"
      }
      // {
      //   name: "Payoneer",
      //   value: "payoneer"
      // }
    ];
  }

  getAddressTypes() {
    return [
      {
        name: "Business",
        value: "businessAddress"
      },
      {
        name: "Residential",
        value: "residentialAddress"
      }
    ];
  }

  getGenre() {
    return [
      {
        name: "Footage",
        value: "footage"
      },
      {
        name: "Music",
        value: "music"
      }
    ];
  }

  getStatusFootages() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "Uploaded",
        value: "upload"
      },
      {
        name: "Rejected",
        value: "pending approval"
      },
      {
        name: "Refused by Curator",
        value: "refused by curator"
      }
    ];
  }

  getModelEthnicities() {
    return [
      {
        name: "African",
        value: "African"
      },
      {
        name: "African American",
        value: "African American"
      },
      {
        name: "Black",
        value: "Black"
      },
      {
        name: "Brazilian",
        value: "Brazilian"
      },
      {
        name: "Chinese",
        value: "Chinese"
      },
      {
        name: "Caucasian (White)",
        value: "Caucasian (White)"
      },
      {
        name: "East Asian",
        value: "East Asian"
      },
      {
        name: "Hispanic (Latin)",
        value: "Hispanic (Latin)"
      },
      {
        name: "Japanese",
        value: "Japanese"
      },
      {
        name: "Middle Eastern",
        value: "Middle Eastern"
      },
      {
        name: "Native American",
        value: "Native American"
      },
      {
        name: "Pacific Islander",
        value: "Pacific Islander"
      },
      {
        name: "South Asian",
        value: "South Asian"
      },
      {
        name: "Southeast Asian",
        value: "Southeast Asian"
      },
      {
        name: "Other",
        value: "Other"
      }
    ];
  }

  getModelAges() {
    return [
      {
        name: "Infant",
        value: "Infant"
      },
      {
        name: "Child",
        value: "Child"
      },
      {
        name: "Teenager",
        value: "Teenager"
      },
      {
        name: "20–29",
        value: "20–29"
      },
      {
        name: "30–39",
        value: "30–39"
      },
      {
        name: "40–49",
        value: "40–49"
      },
      {
        name: "50–59",
        value: "50–59"
      },
      {
        name: "60–69",
        value: "60–69"
      },
      {
        name: "70+",
        value: "70+"
      }
    ];
  }

  getModelGenders() {
    return [
      {
        name: "Male",
        value: "male"
      },
      {
        name: "Female",
        value: "female"
      }
    ];
  }

  getFootageCategories() {
    return [
      {
        text: "-- must select a category --",
        value: ""
      },
      {
        text: "Animals",
        value: "animals"
      },
      {
        text: "Objects & Graphics",
        value: "objectsGraphics"
      },
      {
        text: "Arts & Entertainment",
        value: "artsEntertainment"
      },
      {
        text: "Beauty & Health",
        value: "beautyHealth"
      },
      {
        text: "Business",
        value: "business"
      },
      {
        text: "Food",
        value: "food"
      },
      {
        text: "Drink",
        value: "drink"
      },
      {
        text: "Industry",
        value: "industry"
      },
      {
        text: "Location & Buildings",
        value: "locationBuildings"
      },
      {
        text: "Medical",
        value: "medical"
      },
      {
        text: "Nature",
        value: "nature"
      },
      {
        text: "Objects & Equipment",
        value: "objectsEquipment"
      },
      {
        text: "People",
        value: "people"
      },
      {
        text: "Religion",
        value: "religion"
      },
      {
        text: "Science",
        value: "science"
      },
      {
        text: "Sport & Fitness",
        value: "sportFitness"
      },
      {
        text: "Technology",
        value: "technology"
      },
      {
        text: "Time Lapse",
        value: "timeLapse"
      },
      {
        text: "Transportation",
        value: "transportation"
      },
      {
        text: "Travel",
        value: "travel"
      }
    ];
  }

  getContentFilter() {
    return [
      {
        name: "All",
        value: "A"
      },
      {
        name: "My Shared Assets",
        value: "S"
      },
      {
        name: "My Assets",
        value: "O"
      }
    ];
  }

  getFootageStatus() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "Pending",
        value: "pending"
      },
      {
        name: "Pending Review",
        value: "pending review"
      },
      {
        name: "Ready",
        value: "ready"
      },
      {
        name: "Online",
        value: "online"
      },
      {
        name: "Rejected by Blackbox Reviewer",
        value: "rejected by BB reviewers"
      },
      {
        name: "Rejected by Agencies",
        value: "rejected by agencies"
      }
    ];
  }
  getCurationFootageStatus() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "Incomplete",
        value: "incomplete"
      },
      {
        name: "Completed",
        value: "completed"
      }
    ];
  }

  getProjectFilter() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "My Postings",
        value: "O"
      }
    ];
  }

  getProjectStatus() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "Pending",
        value: "pending"
      },
      {
        name: "Committed",
        value: "committed"
      },
      {
        name: "Completed",
        value: "completed"
      }
    ];
  }

  getCollaborateFilter() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "Upload",
        value: "U"
      }
    ];
  }

  downloadTemplates() {
    return [
      {
        title: "Download .XLS template for footage",
        value: 1
      },
      {
        title: "Download .XLS template for curator",
        value: 2
      },
      {
        title: "Download Blackbox Release Form GUIDELINES",
        value: 3
      },
      {
        title: "Download adult model release form for footage",
        value: 4
      },
      {
        title: "Download minor model release form for footage",
        value: 5
      },
      {
        title: "Download property release form for footage",
        value: 6
      }
    ];
  }

  getProjectSubmitOptions() {
    return [
      {
        name: "Select Curator",
        value: "private"
      },
      {
        name: "Blackbox Assigns Curator",
        value: "Blackbox"
      }
      // ,{
      // 	name: "Community", value: "community"
      // }
    ];
  }

  getPartnerTypes() {
    return {
      sharer: "sharer",
      curator: "curator"
    };
  }

  getReleaseType() {
    return [
      {
        name: "Model Release",
        value: "m"
      },
      {
        name: "Property Release",
        value: "p"
      }
    ];
  }

  getPeriods() {
    return [
      {
        name: "Past 7 days",
        value: 7
      },
      {
        name: "Past 30 days",
        value: 30
      },
      {
        name: "Past 60 days",
        value: 60
      },
      {
        name: "Past 90 days",
        value: 90
      },
      {
        name: "2017",
        value: 2017
      },
      {
        name: "2018",
        value: 2018
      },
      {
        name: "Other",
        value: 0
      }
    ];
  }

  getReportYear() {
    return [
      {
        name: "2018",
        value: 2018
      },
      {
        name: "2017",
        value: 2017
      },
      {
        name: "2016",
        value: 2016
      }
    ];
  }

  getPostingOption() {
    return [
      {
        name: "Private",
        value: "private"
      },
      {
        name: "Marketplace",
        value: "marketplace"
      }
    ];
  }

  getProjectType() {
    return [
      {
        name: "Curation Project",
        value: "curation project"
      },
      {
        name: "Collaborative content creation request",
        value: "collaborative content project"
      }
    ];
  }

  getSelectCollaboratorType() {
    return [
      {
        name: "Indicate number of collaborators to be invited",
        value: "indicate number"
      },
      {
        name: "Search for collaborators",
        value: "sharing percentage"
      }
    ];
  }

  getSubmittedContentType() {
    return [
      {
        name: "Footage",
        value: "footage"
      },
      {
        name: "Media Product",
        value: "media product"
      }
    ];
  }

  getSummaryBy() {
    return [
      {
        name: "Month",
        value: "month"
      },
      {
        name: "Week",
        value: "week"
      }
    ];
  }

  getMemberStatus() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "Approved",
        value: "approved"
      },
      {
        name: "Unapproved",
        value: "unapproved"
      },
      {
        name: "Incomplete Registration",
        value: "incomplete"
      },
      {
        name: "Completed Registration",
        value: "completed"
      },
      {
        name: "Submitted Footage",
        value: "submittedFootage"
      },
      {
        name: "Referral By",
        value: "referralBy"
      }
    ];
  }

  getMemberApprovedStatus() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "Profile Incompleted",
        value: "profileIncompleted"
      },
      {
        name: "Agreement Unaccepted",
        value: "agreementUnaccepted"
      }
    ];
  }

  getMemberSearchAttributes(byAdmin?: any) {
    var searchOptions = [
      {
        name: "Search by Email",
        value: "email"
      },
      {
        name: "Search by Full Name",
        value: "fullName"
      },
      {
        name: "Search by First Name",
        value: "firstName"
      },
      {
        name: "Search By Last Name",
        value: "lastName"
      }      
    ];
    if(byAdmin){
      searchOptions.unshift(
        {
          name: "All",
          value: ""
        }  
      );
    }
    return searchOptions;
  }

  getPayoutStatus() {
    return [
      {
        name: "Pending",
        value: "pending"
      },
      {
        name: "Paid",
        value: "paid"
      }
    ];
  }

  getSpeedLevels() {
    return [
      {
        name: "8x",
        value: "8"
      },
      {
        name: "6x",
        value: "6"
      },
      {
        name: "4x",
        value: "4"
      },
      {
        name: "3x",
        value: "3"
      },
      {
        name: "2x",
        value: "2"
      },
      {
        name: "1x",
        value: "1"
      }
    ];
  }

  getMoreFootages() {
    return [
      {
        name: "Request more content",
        value: 0
      },
      {
        name: "1 item",
        value: 1
      },
      {
        name: "1 batch",
        value: this.constants.batch
      },
      {
        name: "2 batches",
        value: 2 * this.constants.batch
      },
      {
        name: "3 batches",
        value: 3 * this.constants.batch
      }
    ];
  }

  getModelReleaseRejectedReasons() {
    return [
      {
        id: 1,
        content:
          "Photographer / Model / Witness name was not filled in or not legible. (use CAPS and PRINT CLEARLY)"
      },
      {
        id: 2,
        content:
          "Photographer / Model / Witness information was incomplete or illegible. (PRINT CLEARLY)"
      },
      {
        id: 3,
        content:
          "Witness can not be the same person as the Photographer and/or Model."
      },
      {
        id: 4,
        content: "Model / Witness signature dates must match exactly."
      },
      {
        id: 5,
        content: "Missing witness information and signature."
      },
      {
        id: 6,
        content: "Signature(s) not being visible."
      },
      {
        id: 7,
        content: "A release should be a document (form) instead of a graphic image. Release form can be downloaded from Blackbox portal under the Help section."
      }
    ];
  }

  getPropertyReleaseRejectedReasons() {
    return [
      {
        id: 1,
        content:
          "Photographer / Owner or Authorized Representative / Witness name was not filled in or not legible. (use CAPS and PRINT CLEARLY)"
      },
      {
        id: 2,
        content:
          "Photographer / Owner or Authorized Representative / Witness  information was not filled in or not legible. (PRINT CLEARLY)"
      },
      {
        id: 3,
        content:
          "Witness can not be the same person as the Model and/or the Photographer."
      },
      {
        id: 4,
        content:
          "Owner or Authorized Representative / Witness signature dates must match exactly."
      },
      {
        id: 5,
        content: "There is no photo of the property. This is MANDATORY."
      },
      {
        id: 6,
        content: "Signature(s) not being visible."
      },
      {
        id: 7,
        content: "A release should be a document (form) instead of a graphic image. Release form can be downloaded from Blackbox portal under the Help section."
      }
    ];
  }

  getSuggestionReasonRejectBackup() {
    return [
      {
        id: 1,
        title:
          "1. If the video has a recognizable person or persons (multiple people)",
        content:
          "The clip has a recognizable person(s). Therefore a model release(s) is required or the clip must be designated as EDITORIAL.",
        message:
          "The clip has a recognizable person(s). Therefore a model release(s) is required or the clip must be designated as EDITORIAL."
      },
      {
        id: 2,
        title:
          "2. If a video has recognizable (visible) trademark such as brand names or logos: (i.e showing a phone is OK but showing a phone with visible SONY logo/name is not ok)",
        content:
          "The clip has a recognizable and visible trademark(s) such as brand names or logos, etc. Therefore a property release(s) is required or the clip must be designated as EDITORIAL. ",
        message:
          "The clip has a recognizable and visible trademark(s) such as brand names or logos, etc. Therefore a property release(s) is required or the clip must be designated as EDITORIAL."
      },
      {
        id: 3,
        title: "3. If a video is not visible due to lack of focus",
        content:
          "The subject in this clip is not in focus or focus is too soft or inconsistent.",
        message:
          "The subject in this clip is not in focus or focus is too soft or inconsistent."
      },
      {
        id: 4,
        title:
          "4. If see black bars at the top and bottom of the video image, or bars at the left and right of the video image",
        content:
          "The clip is Letterboxed (black bars at the top and bottom), or Pillar-Boxed (black bars at the left and right).",
        message:
          "The clip is Letterboxed (black bars at the top and bottom), or Pillar-Boxed (black bars at the left and right)."
      },
      {
        id: 5,
        title: "5. If a video is shaky or doesn’t have a stable view",
        content: "The clip is shaky or unstable.",
        message: "The clip is shaky or unstable."
      },
      {
        id: 6,
        title:
          "6. If the video has tiny grains (noises) on screen, or distorted (not smooth) images",
        content:
          "The clip contains excessive noise, compression artifacts, or pixelation.",
        message:
          "The clip contains excessive noise, compression artifacts, or pixelation."
      },
      {
        id: 7,
        title:
          "7. If the video has static page (i.e same screen with no motion for the entire duration of playback)",
        content: "The clip has no movement or action.",
        message: "The clip has no movement or action."
      },
      {
        id: 8,
        title:
          "8. If the video has inappropriate content such as pornographically materials or inhuman killing of animals, etc.  (Typically defer it with this reason so the manager can do a final review)",
        content:
          "The clip contains subject matter that is not appropriate for BlackBox.",
        message:
          "The clip contains subject matter that is not appropriate for BlackBox."
      },
      {
        id: 9,
        title:
          "9. If a video doesn’t look good for sale because the shot is silly or doesn’t make a common sense. (Typically defer it with this reason so the manager can do a final review)",
        content: "The clip production value is not sufficient for BlackBox.",
        message: "The clip production value is not sufficient for BlackBox."
      },
      {
        id: 10,
        title: "10. Noise / Artifacts / Pixelation",
        content:
          "Footage contains excessive noise, compression artifacts, pixelation.",
        message:
          "Footage contains excessive noise, compression artifacts, pixelation."
      },
      {
        id: 11,
        title: "11. Intellectual Property",
        message:
          "Clip potentially contains content that infringes on intellectual property rights (artwork, isolated modern architecture, text, etc.).",
        content:
          "Clip potentially contains content that infringes on intellectual property rights (artwork, isolated modern architecture, text, etc.)."
      },
      {
        id: 12,
        title: "12. Exposure / Lighting",
        message:
          "Clip is underexposed, overexposed, inconsistently exposed or was shot in unfavorable lighting conditions.",
        content:
          "Clip is underexposed, overexposed, inconsistently exposed or was shot in unfavorable lighting conditions."
      },
      {
        id: 13,
        title: "13. Editorial Caption",
        message:
          "Captions for editorial clips must include date, location, and factual description. Information must be relevant to the subject matter, and cannot contain special characters.",
        content:
          "Captions for editorial clips must include date, location, and factual description. Information must be relevant to the subject matter, and cannot contain special characters."
      },
      {
        id: 14,
        title: "14. Dust / Dirt / Moisture / Reflections",
        message: "Clip exhibits dust, dirt, moisture or reflections.",
        content: "Clip exhibits dust, dirt, moisture or reflections."
      },
      {
        id: 15,
        title: "15. Frame Rate / Shutter Speed",
        message: "Clip exhibits issues related to frame rate or shutter speed.",
        content: "Clip exhibits issues related to frame rate or shutter speed."
      },
      {
        id: 16,
        title: "16. Distortion / Anomaly",
        message:
          "Clip exhibits distortion or an anomaly that may be related to rolling shutter, image stabilization issues, or other technical issue.",
        content:
          "Clip exhibits distortion or an anomaly that may be related to rolling shutter, image stabilization issues, or other technical issue."
      },
      {
        id: 17,
        title: "17. Composition",
        message:
          "Clip has distracting elements entering the frame, framing issues or the horizon line is uneven.",
        content:
          "Clip has distracting elements entering the frame, framing issues or the horizon line is uneven."
      },
      {
        id: 18,
        title: '18. NOT necessarily designated as EDITORIAL',
        message:
          'This footage is not necessarily designated as EDITORIAL. You might review the content, unselect the editorial, and resubmit.',
        content:
          'This footage is not necessarily designated as EDITORIAL. You might review the content, unselect the editorial, and resubmit.'
      }
    ];
  }

  getSuggestionReasonReject() {
    return [
      {
        id: 1,
        title: 'MODEL RELEASE NEEDED',
        content: 'The clip has a recognizable person(s). Therefore a model release(s) is required or the clip must be designated as EDITORIAL. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        message: 'The clip has a recognizable person(s). Therefore a model release(s) is required or the clip must be designated as EDITORIAL. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 2,
        title: 'PROPERTY RELEASE NEEDED',
        content: 'The clip has a recognizable and visible trademark(s) such as brand names or logos, etc. Therefore a property release(s) is required or the clip must be designated as EDITORIAL. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        message: 'The clip has a recognizable and visible trademark(s) such as brand names or logos, etc. Therefore a property release(s) is required or the clip must be designated as EDITORIAL. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 3,
        title: 'FOCUS ISSUES',
        content: 'The subject in this clip is not in focus or focus is too soft or inconsistent. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        message: 'The subject in this clip is not in focus or focus is too soft or inconsistent. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 4,
        title: 'NOT COMPLIANT',
        content: 'The clip is Letterboxed (black bars at the top and bottom), or Pillar-Boxed (black bars at the left and right). Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        message: 'The clip is Letterboxed (black bars at the top and bottom), or Pillar-Boxed (black bars at the left and right). Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 5,
        title: "EXTRA FRAMES OR JUMP CUTS",
        content: 'The clip must be one continuous shot. Make sure you trim your clips properly. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        message: 'The clip must be one continuous shot. Make sure you trim your clips properly. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 6,
        title: 'UNSTEADY',
        content: 'The clip is shaky or unstable. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        message: 'The clip is shaky or unstable. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 7,
        title: 'NOISE ETC.',
        content: 'The clip contains excessive noise, compression artifacts, pixelation, or posterization. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        message: 'The clip contains excessive noise, compression artifacts, pixelation, or posterization. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 8,
        title: 'STATIC',
        content: 'The clip has no movement or action. Please check  <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        message: 'The clip has no movement or action. Please check  <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 9,
        title: 'INAPPROPRIATE CONTENT',
        content: 'The clip contains subject matter that is not appropriate for BlackBox.',
        message: 'The clip contains subject matter that is not appropriate for BlackBox.'
      },
      {
        id: 10,
        title: 'QUALITY',
        content: 'The  clip does not meet BlackBox standards. Please check  <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        message: 'The  clip does not meet BlackBox standards. Please check  <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 11,
        title: 'EXPOSURE',
        message: 'Clip is underexposed, overexposed, inconsistently exposed or was shot in unfavorable lighting conditions. Please check  <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        content: 'Clip is underexposed, overexposed, inconsistently exposed or was shot in unfavorable lighting conditions. Please check  <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 12,
        title: 'DUST, DIRT ETC.',
        message: 'Clip exhibits dust, dirt, moisture or reflections. Please check  <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        content: 'Clip exhibits dust, dirt, moisture or reflections. Please check  <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 13,
        title: 'ANOMALIES',
        message: 'Clip exhibits distortion or an anomaly that may be related to rolling shutter, image stabilization, or other technical issues. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        content: 'Clip exhibits distortion or an anomaly that may be related to rolling shutter, image stabilization, or other technical issues. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 14,
        title: 'FRAMING',
        message: 'Clip has distracting elements entering the frame, framing issues or the horizon line is uneven. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        content: 'Clip has distracting elements entering the frame, framing issues or the horizon line is uneven. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      },
      {
        id: 15,
        title: 'CAPTION ISSUES',
        message: 'Captions for editorial clips must include date, location, and factual description. Information must be relevant to the subject matter, and cannot contain special characters.',
        content: 'Captions for editorial clips must include date, location, and factual description. Information must be relevant to the subject matter, and cannot contain special characters.'
      },
      {
        id: 16,
        title: 'EDITORIAL DESIGNATION',
        message: 'This clip is not necessarily designated as EDITORIAL. Please review the content, unselect the editorial, and resubmit.',
        content: 'This clip is not necessarily designated as EDITORIAL. Please review the content, unselect the editorial, and resubmit.'
      },
      {
        id: 17,
        title: 'SIMILARITY',
        message: 'This clip is similar to other submitted clips in your collection. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>',
        content: 'This clip is similar to other submitted clips in your collection. Please check <a href="http://bit.ly/BlackBoxQualityStandards" target="_blank">http://bit.ly/BlackBoxQualityStandards</a>'
      }
    ];
  }

  getListToFilterByAgencies() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "BB Reviewer",
        value: "bb_reviewer"
      },
      {
        name: "SS Reviewer",
        value: "ss_reviewer"
      },
      {
        name: "SS Agencies",
        value: "ss_angencies"
      }
    ];
  }

  getListReviewers() {
    return [
      {
        name: "All",
        value: ""
      },
      {
        name: "Reviewer 1",
        value: "reviewer1@mailinator.com"
      },
      {
        name: "Reviewer 2",
        value: "reviewer2@mailinator.com"
      },
      {
        name: "Reviewer 3",
        value: "reviewer3@mailinator.com"
      },
      {
        name: "Reviewer 4",
        value: "reviewer4@mailinator.com"
      },
      {
        name: "Reviewer 5",
        value: "reviewer5@mailinator.com"
      },
      {
        name: "Reviewer 6",
        value: "reviewer6@mailinator.com"
      },
      {
        name: "Reviewer 7",
        value: "reviewer7@mailinator.com"
      },
      {
        name: "Reviewer 8",
        value: "reviewer8@mailinator.com"
      },
      {
        name: "Reviewer 9",
        value: "reviewer9@mailinator.com"
      }
    ];
  }

  getListRejectionReasonsFromSS() {
    return [{
      id: 1,
      title: "1. Noise / Artifacts / Pixelation",
      content: "Footage contains excessive noise, compression artifacts, pixelation.",
      message: "Footage contains excessive noise, compression artifacts, pixelation."
    }, {
      id: 2,
      title: "2. Intellectual Property",
      message: "Clip potentially contains content that infringes on intellectual property rights (artwork, isolated modern architecture, text, etc.).",
      content: "Clip potentially contains content that infringes on intellectual property rights (artwork, isolated modern architecture, text, etc.)."
    }, {
      id: 3,
      title: "3. Exposure / Lighting",
      message: "Clip is underexposed, overexposed, inconsistently exposed or was shot in unfavorable lighting conditions.",
      content: "Clip is underexposed, overexposed, inconsistently exposed or was shot in unfavorable lighting conditions."
    }, {
      id: 4,
      title: "4. Editorial Caption",
      message: "Captions for editorial clips must include date, location, and factual description. Information must be relevant to the subject matter, and cannot contain special characters.",
      content: "Captions for editorial clips must include date, location, and factual description. Information must be relevant to the subject matter, and cannot contain special characters."
    }, {
      id: 5,
      title: "5. Dust / Dirt / Moisture / Reflections",
      message: "Clip exhibits dust, dirt, moisture or reflections.",
      content: "Clip exhibits dust, dirt, moisture or reflections."
    }, {
      id: 6,
      title: "6. Frame Rate / Shutter Speed",
      message: "Clip exhibits issues related to frame rate or shutter speed.",
      content: "Clip exhibits issues related to frame rate or shutter speed."
    }, {
      id: 7,
      title: "7. Distortion / Anomaly",
      message: "Clip exhibits distortion or an anomaly that may be related to rolling shutter, image stabilization issues, or other technical issue.",
      content: "Clip exhibits distortion or an anomaly that may be related to rolling shutter, image stabilization issues, or other technical issue."
    }, {
      id: 8,
      title: "8. Composition",
      message: "Clip has distracting elements entering the frame, framing issues or the horizon line is uneven.",
      content: "Clip has distracting elements entering the frame, framing issues or the horizon line is uneven."
    }, {
      id: 9,
      title: "9. Similarity",
      message: "Similarity",
      content: "Similarity"
    }];
  }

  getStatusReviewingFootages() {
    return [{
      name: "All",
      value: ""
    }, {
      name: "Pending Review",
      value: "pending review"
    }, {
      name: "Rejected",
      value: "rejected"
    }, {
      name: "Downloaded",
      value: "downloaded"
    }];
  }

  getRefusalReasons() {
    return [{
        id: 1,
        message: "We are sorry but we cannot accept your application without valid government issued Photo ID. Please try your registration again."
    }, {
        id: 2,
        message: "Hello, thanks for applying to join BlackBox. Please note that this is a video centric platform and we do not deal with photo content. If in future you wish to join as a video creator please try your registration again."
    }, {
        id: 3,
        message: "We are sorry but we cannot evaluate your application without a comprehensive BIO written in English. Note that the BIO will be used in your BlackBox profile so that other members will be able to learn more about your capabilities as a potential collaborator. Please feel free to apply again."
    }, {
        id: 4,
        message: "We are sorry but we cannot accept your application to join BlackBox at this time because we are only accepting applications from experienced professional creators. Please come back after you have developed your craft and abilities."
    }, {
        id: 5,
        message: "We are sorry but we can not accept your application to join BlackBox as there is a PayPal system block in your area. Please try again once you have access to PayPal."
    }];
  }

  getCameraTypes() {
    return [{
      type: 'HIGH & MID RANGE CINEMA CAMERA',
      brands: [{
        name: 'RED',
        value: 'RED'
      }, {
        name: 'Arri',
        value: 'Arri'
      }, {
        name: 'Canon',
        value: 'Canon'
      }, {
        name: 'Panasonic',
        value: 'Panasonic'
      }, {
        name: 'Sony',
        value: 'Sony'
      }, {
        name: 'BlackMagic',
        value: 'BlackMagic'
      }, {
        name: 'Other (specify)',
        value: 'Other'
      }]
    }, {
      type: 'LOWER END CINEMA CAMERA',
      brands: [{
        name: 'Canon',
        value: 'Canon'
      }, {
        name: 'Panasonic',
        value: 'Panasonic'
      }, {
        name: 'Sony',
        value: 'Sony'
      }, {
        name: 'BlackMagic',
        value: 'BlackMagic'
      }, {
        name: 'Other (specify)',
        value: 'Other'
      }]
    }, {
      type: 'DSLR OR MIRROLESS CAMERA (FULL FRAME OR APS-C)',
      brands: [{
        name: 'Canon',
        value: 'Canon'
      }, {
        name: 'Panasonic',
        value: 'Panasonic'
      }, {
        name: 'Sony',
        value: 'Sony'
      }, {
        name: 'Fuji',
        value: 'Fuji'
      }, {
        name: 'Nikon',
        value: 'Nikon'
      }, {
        name: 'Other (specify)',
        value: 'Other'
      }]
    }, {
      type: 'MICRO FOUR THIRDS CAMERA',
      brands: [{
        name: 'Canon',
        value: 'Canon'
      }, {
        name: 'Panasonic',
        value: 'Panasonic'
      }, {
        name: 'Sony',
        value: 'Sony'
      }, {
        name: 'Fuji',
        value: 'Fuji'
      }, {
        name: 'Nikon',
        value: 'Nikon'
      }, {
        name: 'Other (specify)',
        value: 'Other'
      }]
    }, {
      type: 'DRONE',
      brands: [{
        name: 'DJI',
        value: 'DJI'
      }, {
        name: 'Other (specify)',
        value: 'Other'
      }]
    }, {
      type: 'ACTION CAM',
      brands: [{
        name: 'GOPRO',
        value: 'GOPRO'
      }, {
        name: 'DJI',
        value: 'DJI'
      }, {
        name: 'Other (specify)',
        value: 'Other'
      }]
    }, {
      type: 'PHONE',
      brands: [{
        name: 'Apple',
        value: 'Apple'
      }, {
        name: 'Google',
        value: 'Google'
      }, {
        name: 'Sony',
        value: 'Sony'
      }, {
        name: 'Other (specify)',
        value: 'Other'
      }]
    }, {
      type: 'NOT APPLICABLE',
      brands: []
    }]
  }

  getBioData() {
    return [{
      id: 1,
      question: "How long have you been doing video related work?",
      answerTitle: "Video related work",
      answerContent: ""
    }, {
      id: 2,
      question: "What training and certification do you have?",
      answerTitle: "Training/certification",
      answerContent: ""
    }, {
      id: 3,
      question: "What is your specialization?",
      answerTitle: "Specialization",
      answerContent: ""
    }, {
      id: 4,
      question: "Tell us about your experience as a creator?",
      answerTitle: "Creator experience",
      answerContent: ""
    }, {
      id: 5,
      question: "What are your goals as a creator?",
      answerTitle: "Creator goals",
      answerContent: ""
    }]
  }
  
  sendPrivateEmail(email) {
    var url = this.apiUrl.send_private_email.replace("{memberId}", localStorage.getItem('userid'));
    var body = {
      email: email
    };
    return this._apiService.httpPost(url, body);
  }
}
