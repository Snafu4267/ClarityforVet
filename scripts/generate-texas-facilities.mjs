/**
 * One-time / occasional: builds geocoded facilities from VA.gov address lists.
 * Usage: node scripts/generate-texas-facilities.mjs
 * Writes: data/texas-facilities-geocoded.json (UTF-8)
 * Respects Nominatim usage policy (1.1s between requests).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "data", "texas-facilities-geocoded.json");

const UA = "VetToVetMVP/1.0 (local dev; vet education site)";

const raw = [
  // VA North Texas  -  va.gov/north-texas-health-care/locations
  { id: "ntx-dallas-vamc", name: "Dallas VA Medical Center", kind: "VAMC", system: "VA North Texas Health Care", address: "4500 South Lancaster Road", city: "Dallas", state: "TX", zip: "75216-7167", phoneMain: "214-742-8387", hoursSummary: "VAMC; outpatient hours vary by clinic. Appointments: 800-849-3597.", sourceUrl: "https://www.va.gov/north-texas-health-care/locations/" },
  { id: "ntx-garland-vamc", name: "Garland VA Medical Center", kind: "VAMC", system: "VA North Texas Health Care", address: "2300 Marie Curie Boulevard", city: "Garland", state: "TX", zip: "75042-5706", phoneMain: "469-797-2100", hoursSummary: "VAMC; confirm service hours when scheduling.", sourceUrl: "https://www.va.gov/north-texas-health-care/locations/" },
  { id: "ntx-bonham", name: "Sam Rayburn Memorial Veterans Center", kind: "VAMC", system: "VA North Texas Health Care", address: "1201 East 9th Street", city: "Bonham", state: "TX", zip: "75418-4059", phoneMain: "903-583-2111", hoursSummary: "VAMC; call for clinic-specific hours.", sourceUrl: "https://www.va.gov/north-texas-health-care/locations/" },
  { id: "ntx-dallas-crrc", name: "Dallas VA  -  Community Resource & Referral Center (South Lancaster)", kind: "CBOC", system: "VA North Texas Health Care", address: "4900 South Lancaster Road", city: "Dallas", state: "TX", zip: "75216-7402", phoneMain: "214-742-8387", hoursSummary: "CRRC; hours vary - confirm with VA.", sourceUrl: "https://www.va.gov/north-texas-health-care/locations/" },
  { id: "ntx-decatur", name: "Decatur VA Clinic", kind: "CBOC", system: "VA North Texas Health Care", address: "408 Park West Court", city: "Decatur", state: "TX", zip: "76234-3203", phoneMain: "940-627-7001", hoursSummary: "Outpatient; confirm appointment window.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },
  { id: "ntx-denton", name: "Denton VA Clinic", kind: "CBOC", system: "VA North Texas Health Care", address: "2322 San Jacinto Boulevard", city: "Denton", state: "TX", zip: "76205-7532", phoneMain: "940-891-6350", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },
  { id: "ntx-fort-worth-crrc", name: "Fort Worth VA  -  Community Resource & Referral Center", kind: "CBOC", system: "VA North Texas Health Care", address: "101 New York Avenue", city: "Fort Worth", state: "TX", zip: "76104-1558", phoneMain: "817-730-0000", hoursSummary: "CRRC.", sourceUrl: "https://www.va.gov/north-texas-health-care/locations/" },
  { id: "ntx-fort-worth-loop", name: "Fort Worth VA Clinic (Southeast Loop 820)", kind: "CBOC", system: "VA North Texas Health Care", address: "2201 Southeast Loop 820", city: "Fort Worth", state: "TX", zip: "76119-5863", phoneMain: "817-730-0000", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },
  { id: "ntx-granbury", name: "Granbury VA Clinic", kind: "CBOC", system: "VA North Texas Health Care", address: "1210 Paluxy Medical Circle", city: "Granbury", state: "TX", zip: "76048-5699", phoneMain: "817-573-2321", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },
  { id: "ntx-grand-prairie", name: "Grand Prairie VA Clinic", kind: "CBOC", system: "VA North Texas Health Care", address: "2737 Sherman Street", city: "Grand Prairie", state: "TX", zip: "75051-1027", phoneMain: "214-857-3450", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },
  { id: "ntx-greenville", name: "Greenville VA Clinic", kind: "CBOC", system: "VA North Texas Health Care", address: "8325 Jack Finney Boulevard", city: "Greenville", state: "TX", zip: "75402-3005", phoneMain: "903-450-1143", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },
  { id: "ntx-polk-dallas", name: "Dallas VA Clinic (South Polk Street)", kind: "CBOC", system: "VA North Texas Health Care", address: "4243 South Polk Street", city: "Dallas", state: "TX", zip: "75224-4928", phoneMain: "214-372-8100", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },
  { id: "ntx-sherman", name: "Sherman VA Clinic", kind: "CBOC", system: "VA North Texas Health Care", address: "1715 Texoma Parkway", city: "Sherman", state: "TX", zip: "75090-2613", phoneMain: "903-487-0477", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },
  { id: "ntx-tyler", name: "Tyler VA Clinic (Centennial Parkway)", kind: "CBOC", system: "VA North Texas Health Care", address: "428 Centennial Parkway", city: "Tyler", state: "TX", zip: "75703-7166", phoneMain: "855-375-6930", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },
  { id: "ntx-plano", name: "Plano VA Clinic", kind: "CBOC", system: "VA North Texas Health Care", address: "3804 West 15th Street, Suite 175", city: "Plano", state: "TX", zip: "75075-4752", phoneMain: "972-801-4200", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/north-texas-health-care/contact-us/" },

  // VA Central Texas  -  va.gov/central-texas-health-care/locations
  { id: "ctx-temple-main", name: "VA Central Texas  -  Temple (main campus)", kind: "CBOC", system: "VA Central Texas Health Care", address: "1901 Veterans Memorial Drive", city: "Temple", state: "TX", zip: "76504-7451", phoneMain: "800-423-2111", hoursSummary: "Temple campus; Doris Miller inpatient hospital is in Waco.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/" },
  { id: "ctx-waco-doris", name: "Doris Miller VA Medical Center", kind: "VAMC", system: "VA Central Texas Health Care", address: "4800 Memorial Drive", city: "Waco", state: "TX", zip: "76711-1329", phoneMain: "800-423-2111", hoursSummary: "VAMC; building hours and service hours differ - see VA.gov.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/doris-miller-department-of-veterans-affairs-medical-center/" },
  { id: "ctx-austin", name: "Austin VA Clinic", kind: "CBOC", system: "VA Central Texas Health Care", address: "7901 Metropolis Drive", city: "Austin", state: "TX", zip: "78744-3111", phoneMain: "512-823-4000", hoursSummary: "Outpatient multispecialty; typically weekday hours.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/austin-va-clinic/" },
  { id: "ctx-brownwood", name: "Brownwood VA Clinic", kind: "CBOC", system: "VA Central Texas Health Care", address: "2600 Memorial Park Drive", city: "Brownwood", state: "TX", zip: "76801-5950", phoneMain: "800-423-2111", hoursSummary: "Outpatient; confirm clinic hours with VA Health Connect / scheduling.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/" },
  { id: "ctx-college-station", name: "College Station VA Clinic", kind: "CBOC", system: "VA Central Texas Health Care", address: "1651 Rock Prairie Road, Suite 100", city: "College Station", state: "TX", zip: "77845-8652", phoneMain: "800-423-2111", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/" },
  { id: "ctx-cedar-park", name: "Cedar Park VA Clinic", kind: "CBOC", system: "VA Central Texas Health Care", address: "1401 Medical Parkway, Suite 400, Building C", city: "Cedar Park", state: "TX", zip: "78613-2216", phoneMain: "800-423-2111", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/" },
  { id: "ctx-copperas-cove", name: "Copperas Cove VA Clinic", kind: "CBOC", system: "VA Central Texas Health Care", address: "336 Town Square, Town Square Plaza", city: "Copperas Cove", state: "TX", zip: "76522-2800", phoneMain: "800-423-2111", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/" },
  { id: "ctx-killeen", name: "Killeen VA Clinic", kind: "CBOC", system: "VA Central Texas Health Care", address: "1001 East Veterans Memorial Boulevard, Midtown Mall, Suite 400", city: "Killeen", state: "TX", zip: "76541-7292", phoneMain: "800-423-2111", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/" },
  { id: "ctx-lagrange", name: "LaGrange VA Clinic", kind: "CBOC", system: "VA Central Texas Health Care", address: "2 Saint Marks Place", city: "LaGrange", state: "TX", zip: "78945-1251", phoneMain: "800-423-2111", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/" },
  { id: "ctx-palestine", name: "Palestine VA Clinic", kind: "CBOC", system: "VA Central Texas Health Care", address: "300 Willow Creek Parkway, Willow Creek Medical Plaza, Suite 100", city: "Palestine", state: "TX", zip: "75801-4433", phoneMain: "800-423-2111", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/" },
  { id: "ctx-temple-south", name: "Temple VA Clinic (South General Bruce Drive)", kind: "CBOC", system: "VA Central Texas Health Care", address: "4501 South General Bruce Drive, Suite 75", city: "Temple", state: "TX", zip: "76502-1466", phoneMain: "800-423-2111", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/central-texas-health-care/locations/" },

  // VA South Texas  -  va.gov/south-texas-health-care/locations
  { id: "stx-audie", name: "Audie L. Murphy Memorial Veterans Hospital", kind: "VAMC", system: "South Texas Veterans Health Care", address: "7400 Merton Minter Boulevard", city: "San Antonio", state: "TX", zip: "78229-4404", phoneMain: "210-617-5300", hoursSummary: "VAMC; main system line for many services.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-kerrville", name: "Kerrville VA Medical Center", kind: "VAMC", system: "South Texas Veterans Health Care", address: "3600 Memorial Boulevard", city: "Kerrville", state: "TX", zip: "78028-5768", phoneMain: "830-896-2020", hoursSummary: "VAMC.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-fredericksburg-suites", name: "San Antonio VA Clinic (Fredericksburg Road)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "4522 Fredericksburg Road, Suites A10, A88, A100", city: "San Antonio", state: "TX", zip: "78201", phoneMain: "210-617-5300", hoursSummary: "Outpatient; use main line for scheduling.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-data-point", name: "San Antonio VA Clinic (Data Point Drive)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "8410 Data Point Drive", city: "San Antonio", state: "TX", zip: "78229-3220", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-new-braunfels", name: "New Braunfels VA Clinic", kind: "CBOC", system: "South Texas Veterans Health Care", address: "790 Generations Drive, Suite 700", city: "New Braunfels", state: "TX", zip: "78130-0086", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-nacogdoches", name: "San Antonio VA Clinic (Nacogdoches Road)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "16019 Nacogdoches Road, Suite 101", city: "San Antonio", state: "TX", zip: "78247-1128", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-henderson", name: "San Antonio VA Clinic (Henderson Pass)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "17440 Henderson Pass", city: "San Antonio", state: "TX", zip: "78232-1662", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-loop410", name: "San Antonio VA Clinic (Northeast Loop 410)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "2391 Northeast Loop 410, Marymont Business Park, Suite 309", city: "San Antonio", state: "TX", zip: "78217-5675", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-hw151", name: "San Antonio VA Clinic (State Highway 151)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "9939 State Highway 151", city: "San Antonio", state: "TX", zip: "78251-1900", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-southcross", name: "San Antonio VA Clinic (East Southcross Boulevard)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "3418 East Southcross Boulevard", city: "San Antonio", state: "TX", zip: "78223-1633", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-randolph", name: "Randolph AFB VA Clinic", kind: "CBOC", system: "South Texas Veterans Health Care", address: "221 Third Street West", city: "Randolph Air Force Base", state: "TX", zip: "78150-4800", phoneMain: "210-617-5300", hoursSummary: "On-base access rules apply - call ahead.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-fred-100", name: "San Antonio VA Clinic (7909 Fredericksburg Road)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "7909 Fredericksburg Road, Suite 100", city: "San Antonio", state: "TX", zip: "78229-3403", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-lockhill", name: "San Antonio VA Clinic (Lockhill-Selma Road)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "4350 Lockhill-Selma Road, Suite 200", city: "San Antonio", state: "TX", zip: "78249-2166", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-southcross-4610", name: "San Antonio VA Clinic (4610 East Southcross)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "4610 East Southcross Boulevard, Suite 100", city: "San Antonio", state: "TX", zip: "78222-4911", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-sw-military", name: "San Antonio VA Clinic (Southwest Military Drive)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "2310 Southwest Military Drive, Suite 304", city: "San Antonio", state: "TX", zip: "78224-1460", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-victoria", name: "Victoria VA Clinic", kind: "CBOC", system: "South Texas Veterans Health Care", address: "311 Spring Green Boulevard", city: "Victoria", state: "TX", zip: "77904", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },
  { id: "stx-sa-walzem", name: "San Antonio VA Clinic (Walzem Road)", kind: "CBOC", system: "South Texas Veterans Health Care", address: "6938 Walzem Road", city: "San Antonio", state: "TX", zip: "78239-3641", phoneMain: "210-617-5300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/south-texas-health-care/locations/" },

  // VA Houston  -  va.gov/houston-health-care/locations
  { id: "hou-debakey", name: "Michael E. DeBakey VA Medical Center", kind: "VAMC", system: "VA Houston Health Care", address: "2002 Holcombe Boulevard", city: "Houston", state: "TX", zip: "77030-4211", phoneMain: "713-791-1414", hoursSummary: "VAMC; VA Health Connect for appointments: 713-794-8985.", sourceUrl: "https://www.va.gov/houston-health-care/locations/" },
  { id: "hou-beaumont", name: "Beaumont VA Outpatient Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "3420 Veterans Circle", city: "Beaumont", state: "TX", zip: "77707-2552", phoneMain: "409-981-8550", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/houston-health-care/contact-us/" },
  { id: "hou-lufkin", name: "Charles Wilson VA Outpatient Clinic (Lufkin)", kind: "CBOC", system: "VA Houston Health Care", address: "2206 North John Redditt Drive", city: "Lufkin", state: "TX", zip: "75904-1776", phoneMain: "936-671-4300", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/houston-health-care/contact-us/" },
  { id: "hou-conroe", name: "Conroe VA Outpatient Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "690 South Loop 336 West, Suite 300", city: "Conroe", state: "TX", zip: "77304-3320", phoneMain: "936-522-4000", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/houston-health-care/contact-us/" },
  { id: "hou-galveston", name: "Galveston VA Outpatient Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "500 Seawall Boulevard, Suite 390", city: "Galveston", state: "TX", zip: "77550-5526", phoneMain: "409-791-3200", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/houston-health-care/contact-us/" },
  { id: "hou-crrc-webster", name: "Houston VA  -  Community Resource & Referral Center (Webster Street)", kind: "CBOC", system: "VA Houston Health Care", address: "1700 Webster Street", city: "Houston", state: "TX", zip: "77003-5827", phoneMain: "713-791-1414", hoursSummary: "CRRC; confirm hours.", sourceUrl: "https://www.va.gov/houston-health-care/locations/" },
  { id: "hou-katy", name: "Katy VA Outpatient Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "750 Westgreen Boulevard, Westgreen Professional Building", city: "Katy", state: "TX", zip: "77450-2799", phoneMain: "713-794-8985", hoursSummary: "Outpatient; VA Health Connect for scheduling.", sourceUrl: "https://www.va.gov/houston-health-care/locations/" },
  { id: "hou-humble", name: "Humble/Kingwood VA Outpatient Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "1485 FM 1960 Bypass Road East, Humble Medical Plaza, Suite 340", city: "Humble", state: "TX", zip: "77338-3965", phoneMain: "281-540-5018", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/houston-health-care/contact-us/" },
  { id: "hou-lake-jackson", name: "Lake Jackson VA Outpatient Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "208 South Oak Drive, Suite 700", city: "Lake Jackson", state: "TX", zip: "77566-5789", phoneMain: "979-230-4852", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/houston-health-care/contact-us/" },
  { id: "hou-richmond", name: "Richmond VA Outpatient Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "22001 Southwest Freeway, Suite 200", city: "Richmond", state: "TX", zip: "77469-7002", phoneMain: "832-595-7700", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/houston-health-care/contact-us/" },
  { id: "hou-sugar-land", name: "Sugar Land VA Outpatient Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "1327 Lake Pointe Parkway, Suite 515", city: "Sugar Land", state: "TX", zip: "77478-4095", phoneMain: "281-275-8900", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/houston-health-care/contact-us/" },
  { id: "hou-texas-city", name: "Texas City VA Outpatient Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "9300 Emmett F. Lowery Expressway, Suite 206", city: "Texas City", state: "TX", zip: "77591-2134", phoneMain: "409-986-2900", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/houston-health-care/contact-us/" },
  { id: "hou-tomball", name: "Tomball VA Clinic", kind: "CBOC", system: "VA Houston Health Care", address: "1200 West Main Street", city: "Tomball", state: "TX", zip: "77375-5522", phoneMain: "281-516-1505", hoursSummary: "Outpatient CBOC; no emergency care at this site.", sourceUrl: "https://www.va.gov/houston-health-care/locations/tomball-va-clinic/" },

  // VA West Texas  -  va.gov/west-texas-health-care/locations (excludes Hobbs NM)
  { id: "wtx-big-spring", name: "George H. O'Brien Jr. VA Medical Center", kind: "VAMC", system: "VA West Texas Health Care", address: "300 Veterans Boulevard", city: "Big Spring", state: "TX", zip: "79720-5566", phoneMain: "432-263-7361", hoursSummary: "VAMC; use prompts for appointments and clinics.", sourceUrl: "https://www.va.gov/west-texas-health-care/locations/" },
  { id: "wtx-abilene", name: "Abilene VA Clinic", kind: "CBOC", system: "VA West Texas Health Care", address: "3850 Ridgemont Drive", city: "Abilene", state: "TX", zip: "79606-2728", phoneMain: "432-263-7361", hoursSummary: "Outpatient; confirm with West Texas system.", sourceUrl: "https://www.va.gov/west-texas-health-care/locations/" },
  { id: "wtx-san-angelo", name: "San Angelo VA Clinic", kind: "CBOC", system: "VA West Texas Health Care", address: "4240 Southwest Boulevard", city: "San Angelo", state: "TX", zip: "76904-5634", phoneMain: "432-263-7361", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/west-texas-health-care/locations/" },
  { id: "wtx-fort-stockton", name: "Fort Stockton VA Clinic", kind: "CBOC", system: "VA West Texas Health Care", address: "1205 North Sycamore Street", city: "Fort Stockton", state: "TX", zip: "79735-4122", phoneMain: "432-263-7361", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/west-texas-health-care/contact-us/" },
  { id: "wtx-odessa", name: "Odessa VA Clinic", kind: "CBOC", system: "VA West Texas Health Care", address: "8050 East Highway 191", city: "Odessa", state: "TX", zip: "79765-8615", phoneMain: "432-263-7361", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/west-texas-health-care/locations/" },

  // VA Texas Valley  -  va.gov/texas-valley-health-care/locations
  { id: "tv-harlingen-main", name: "Harlingen VA Clinic (main  -  Veterans Drive)", kind: "VAMC", system: "VA Texas Valley Health Care", address: "2601 Veterans Drive", city: "Harlingen", state: "TX", zip: "78550-8942", phoneMain: "956-291-9000", hoursSummary: "Main Valley campus; confirm hours on VA.gov.", sourceUrl: "https://www.va.gov/texas-valley-health-care/locations/harlingen-va-clinic/" },
  { id: "tv-brownsville", name: "Brownsville VA Clinic", kind: "CBOC", system: "VA Texas Valley Health Care", address: "5700 North Expressway, Texas Coastal Professional Building, Suite 101", city: "Brownsville", state: "TX", zip: "78526-4354", phoneMain: "956-291-9000", hoursSummary: "Outpatient; confirm clinic line on VA.gov.", sourceUrl: "https://www.va.gov/texas-valley-health-care/locations/" },
  { id: "tv-cc-old-brownsville-rd", name: "Corpus Christi VA Clinic (Old Brownsville Road)", kind: "CBOC", system: "VA Texas Valley Health Care", address: "5283 Old Brownsville Road", city: "Corpus Christi", state: "TX", zip: "78405-3908", phoneMain: "956-291-9000", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/texas-valley-health-care/locations/" },
  { id: "tv-cc-padre-island", name: "Corpus Christi VA Clinic (South Padre Island Drive)", kind: "CBOC", system: "VA Texas Valley Health Care", address: "925 South Padre Island Drive", city: "Corpus Christi", state: "TX", zip: "78416-2536", phoneMain: "956-291-9000", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/texas-valley-health-care/locations/" },
  { id: "tv-harlingen-treasure", name: "Harlingen VA Clinic (Treasure Hills Boulevard)", kind: "CBOC", system: "VA Texas Valley Health Care", address: "2106 Treasure Hills Boulevard", city: "Harlingen", state: "TX", zip: "78550-8736", phoneMain: "956-291-9000", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/texas-valley-health-care/locations/" },
  { id: "tv-laredo", name: "Laredo VA Clinic", kind: "CBOC", system: "VA Texas Valley Health Care", address: "4602 North Bartlett Avenue", city: "Laredo", state: "TX", zip: "78041-3803", phoneMain: "956-291-9000", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/texas-valley-health-care/locations/" },
  { id: "tv-mcallen", name: "McAllen VA Clinic", kind: "CBOC", system: "VA Texas Valley Health Care", address: "901 East Hackberry Avenue", city: "McAllen", state: "TX", zip: "78501-6502", phoneMain: "956-291-9000", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/texas-valley-health-care/locations/" },
  { id: "tv-cc-enterprise", name: "Corpus Christi VA Clinic (South Enterprize Parkway)", kind: "CBOC", system: "VA Texas Valley Health Care", address: "205 South Enterprize Parkway", city: "Corpus Christi", state: "TX", zip: "78405-4118", phoneMain: "956-291-9000", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/texas-valley-health-care/locations/" },

  // VA El Paso  -  va.gov/el-paso-health-care/locations (excludes Las Cruces NM)
  { id: "elp-main", name: "El Paso VA Clinic (North Piedras Street  -  main)", kind: "VAMC", system: "VA El Paso Health Care", address: "5001 North Piedras Street", city: "El Paso", state: "TX", zip: "79930-4210", phoneMain: "915-564-6100", hoursSummary: "Main El Paso campus; follow phone prompts.", sourceUrl: "https://www.va.gov/el-paso-health-care/locations/" },
  { id: "elp-cliff", name: "El Paso VA Clinic (East Cliff Drive)", kind: "CBOC", system: "VA El Paso Health Care", address: "1250-B East Cliff Drive", city: "El Paso", state: "TX", zip: "79902-4823", phoneMain: "915-564-6100", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/el-paso-health-care/locations/" },
  { id: "elp-trawood", name: "El Paso VA Clinic (Trawood Drive)", kind: "CBOC", system: "VA El Paso Health Care", address: "2400 Trawood Drive, Suite 200", city: "El Paso", state: "TX", zip: "79936-4122", phoneMain: "915-564-6100", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/el-paso-health-care/locations/" },
  { id: "elp-sanders", name: "El Paso VA Clinic (Sanders Avenue)", kind: "CBOC", system: "VA El Paso Health Care", address: "5229 Sanders Avenue", city: "El Paso", state: "TX", zip: "79924-6409", phoneMain: "915-564-6100", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/el-paso-health-care/locations/" },
  { id: "elp-revere", name: "El Paso VA Clinic (Revere Street)", kind: "CBOC", system: "VA El Paso Health Care", address: "350 Revere Street", city: "El Paso", state: "TX", zip: "79905-1633", phoneMain: "915-564-6100", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/el-paso-health-care/locations/" },
  { id: "elp-northwestern", name: "El Paso VA Clinic (Northwestern Drive)", kind: "CBOC", system: "VA El Paso Health Care", address: "1870 Northwestern Drive", city: "El Paso", state: "TX", zip: "79912-1121", phoneMain: "915-564-6100", hoursSummary: "Outpatient.", sourceUrl: "https://www.va.gov/el-paso-health-care/locations/" },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function nominatimSearch(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=us`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.length) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

async function geocode(row) {
  const zip5 = row.zip.split("-")[0];
  let pt = await nominatimSearch(`${row.address}, ${row.city}, TX ${row.zip}`);
  if (!pt) {
    await sleep(1100);
    pt = await nominatimSearch(`${row.address}, ${row.city}, TX ${zip5}`);
  }
  if (!pt) {
    await sleep(1100);
    pt = await nominatimSearch(`${row.city}, TX ${zip5}`);
  }
  if (!pt) {
    console.error(JSON.stringify({ warn: "no geocode", id: row.id }));
    return { ...row, lat: 31.0, lng: -99.0 };
  }
  return { ...row, ...pt };
}

const out = [];
for (let i = 0; i < raw.length; i++) {
  out.push(await geocode(raw[i]));
  if (i < raw.length - 1) await sleep(1100);
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.error(`Wrote ${out.length} facilities to ${outPath}`);
