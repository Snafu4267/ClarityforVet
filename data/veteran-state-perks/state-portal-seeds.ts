/**
 * Official state veterans office URLs as listed in the NASDVA Resources directory
 * (https://nasdva.us/resources/, accessed 2026). Curators should re-check links periodically.
 */
export type StatePortalSeed = {
  code: string;
  name: string;
  agency: string;
  url: string;
};

export const STATE_PORTAL_SEEDS: StatePortalSeed[] = [
  { code: "AL", name: "Alabama", agency: "Alabama Department of Veterans Affairs", url: "https://va.alabama.gov/" },
  { code: "AK", name: "Alaska", agency: "Alaska Office of Veterans Affairs", url: "https://veterans.alaska.gov/" },
  { code: "AZ", name: "Arizona", agency: "Arizona Department of Veterans Services", url: "https://dvs.az.gov/" },
  { code: "AR", name: "Arkansas", agency: "Arkansas Department of Veterans Affairs", url: "https://www.veterans.arkansas.gov/" },
  { code: "CA", name: "California", agency: "California Department of Veterans Affairs (CalVet)", url: "https://www.calvet.ca.gov/" },
  { code: "CO", name: "Colorado", agency: "Colorado Division of Veterans Affairs", url: "https://www.colorado.gov/vets" },
  { code: "CT", name: "Connecticut", agency: "Connecticut Department of Veterans Affairs", url: "https://portal.ct.gov/DVA/" },
  { code: "DE", name: "Delaware", agency: "Delaware Office of Veterans Services", url: "https://veteransaffairs.delaware.gov/" },
  {
    code: "DC",
    name: "District of Columbia",
    agency: "District of Columbia Office of Veterans Affairs",
    url: "https://ovs.dc.gov/",
  },
  { code: "FL", name: "Florida", agency: "Florida Department of Veterans Affairs", url: "https://www.floridavets.org/" },
  { code: "GA", name: "Georgia", agency: "Georgia Department of Veterans Service", url: "https://veterans.georgia.gov/" },
  { code: "HI", name: "Hawaii", agency: "Hawaii Office of Veterans Services", url: "https://dod.hawaii.gov/" },
  { code: "ID", name: "Idaho", agency: "Idaho Division of Veterans Services", url: "https://www.veterans.idaho.gov/" },
  { code: "IL", name: "Illinois", agency: "Illinois Department of Veterans Affairs", url: "https://veterans.illinois.gov/" },
  { code: "IN", name: "Indiana", agency: "Indiana Department of Veterans Affairs", url: "https://www.in.gov/dva/" },
  { code: "IA", name: "Iowa", agency: "Iowa Department of Veterans Affairs", url: "https://va.iowa.gov/" },
  { code: "KS", name: "Kansas", agency: "Kansas Commission on Veterans Affairs", url: "https://kcva.ks.gov/" },
  { code: "KY", name: "Kentucky", agency: "Kentucky Department of Veterans Affairs", url: "https://veterans.ky.gov/Pages/default.aspx" },
  { code: "LA", name: "Louisiana", agency: "Louisiana Department of Veterans Affairs", url: "https://www.vetaffairs.la.gov/" },
  { code: "ME", name: "Maine", agency: "Maine Bureau of Veterans Services", url: "https://www.maine.gov/veterans/" },
  { code: "MD", name: "Maryland", agency: "Maryland Department of Veterans Affairs", url: "https://veterans.maryland.gov/" },
  { code: "MA", name: "Massachusetts", agency: "Massachusetts Department of Veterans Services", url: "https://www.mass.gov/orgs/massachusetts-department-of-veterans-services" },
  { code: "MI", name: "Michigan", agency: "Michigan Veterans Affairs Agency", url: "https://www.michigan.gov/mvaa" },
  { code: "MN", name: "Minnesota", agency: "Minnesota Department of Veterans Affairs", url: "https://mn.gov/mdva/" },
  { code: "MS", name: "Mississippi", agency: "Mississippi Veterans Affairs Board", url: "https://www.msva.ms.gov/" },
  { code: "MO", name: "Missouri", agency: "Missouri Veterans Commission", url: "https://mvc.dps.mo.gov/" },
  { code: "MT", name: "Montana", agency: "Montana Veterans Affairs (DMA)", url: "https://dma.mt.gov/" },
  { code: "NE", name: "Nebraska", agency: "Nebraska Department of Veterans Affairs", url: "https://veterans.nebraska.gov/" },
  { code: "NV", name: "Nevada", agency: "Nevada Department of Veterans Services", url: "https://veterans.nv.gov/" },
  { code: "NH", name: "New Hampshire", agency: "New Hampshire Office of Veterans Services", url: "https://www.dmavs.nh.gov/veterans-services" },
  { code: "NJ", name: "New Jersey", agency: "New Jersey Department of Military and Veterans Affairs", url: "https://www.nj.gov/military/" },
  { code: "NM", name: "New Mexico", agency: "New Mexico Department of Veterans Services", url: "https://www.nmdvs.org/" },
  { code: "NY", name: "New York", agency: "New York State Division of Veterans Services", url: "https://veterans.ny.gov/" },
  { code: "NC", name: "North Carolina", agency: "North Carolina Department of Military and Veterans Affairs", url: "https://www.milvets.nc.gov/" },
  { code: "ND", name: "North Dakota", agency: "North Dakota Veterans Affairs", url: "https://www.nd.gov/veterans/" },
  { code: "OH", name: "Ohio", agency: "Ohio Department of Veterans Services", url: "https://dvs.ohio.gov/wps/portal/gov/dvs/" },
  { code: "OK", name: "Oklahoma", agency: "Oklahoma Department of Veterans Affairs", url: "https://oklahoma.gov/veterans.html" },
  { code: "OR", name: "Oregon", agency: "Oregon Department of Veterans Affairs", url: "https://www.oregon.gov/odva/Pages/default.aspx" },
  { code: "PA", name: "Pennsylvania", agency: "Pennsylvania Department of Military and Veterans Affairs", url: "https://www.dmva.pa.gov/Pages/default.aspx" },
  { code: "RI", name: "Rhode Island", agency: "Rhode Island Office of Veterans Services", url: "https://www.vets.ri.gov/" },
  { code: "SC", name: "South Carolina", agency: "South Carolina Department of Veterans Affairs", url: "https://scdva.sc.gov/" },
  { code: "SD", name: "South Dakota", agency: "South Dakota Department of Veterans Affairs", url: "https://vetaffairs.sd.gov/" },
  { code: "TN", name: "Tennessee", agency: "Tennessee Department of Veterans Services", url: "https://www.tn.gov/veteran/" },
  { code: "TX", name: "Texas", agency: "Texas Veterans Commission", url: "https://www.tvc.texas.gov/" },
  { code: "UT", name: "Utah", agency: "Utah Department of Veterans and Military Affairs", url: "https://veterans.utah.gov/" },
  { code: "VT", name: "Vermont", agency: "Vermont Office of Veterans Affairs", url: "https://veterans.vermont.gov/" },
  { code: "VA", name: "Virginia", agency: "Virginia Department of Veterans Services", url: "https://www.dvs.virginia.gov/" },
  { code: "WA", name: "Washington", agency: "Washington State Department of Veterans Affairs", url: "https://www.dva.wa.gov/" },
  { code: "WV", name: "West Virginia", agency: "West Virginia Department of Veterans Assistance", url: "https://veterans.wv.gov/Pages/default.aspx" },
  { code: "WI", name: "Wisconsin", agency: "Wisconsin Department of Veterans Affairs", url: "https://dva.wi.gov/Pages/Home.aspx" },
  { code: "WY", name: "Wyoming", agency: "Wyoming Veterans Commission", url: "https://www.wyomilitary.wyo.gov/veterans/" },
];
