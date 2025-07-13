export type TagCategory = 
  | 'Electrolytes' 
  | 'Caffeine' 
  | 'Salts' 
  | 'Vitamins' 
  | 'Amino Acids' 
  | 'Nootropics'
  | 'Adaptogens';

// Map ingredients to categories
export const ingredientTagMap: Record<string, TagCategory[]> = {
  // Electrolytes (Elektrolüüdid)
'naatrium': ['Electrolytes', 'Salts'],
'naatriumkloriid': ['Electrolytes', 'Salts'],
'naatriumbikarbonaaat': ['Electrolytes', 'Salts'],
'naatriumatsetaat': ['Electrolytes', 'Salts'],
'naatriumtsitraat': ['Electrolytes', 'Salts'],
'naatriumlaktaat': ['Electrolytes', 'Salts'],
'naatriumglutamaat': ['Electrolytes', 'Salts'],
'naatriumfosfaat': ['Electrolytes', 'Salts'],
'naatriumisoolad': ['Electrolytes', 'Salts'],
'naatriumi soolad': ['Electrolytes', 'Salts'],

'kaalium': ['Electrolytes'],
'kaaliumkloriid': ['Electrolytes'],
'kaaliumtsitraat': ['Electrolytes'],
'kaaliumfosfaat': ['Electrolytes'],
'kaaliumlaktaat': ['Electrolytes'],
'kaaliumbikarbonaat': ['Electrolytes'],
'kaaliumisoolad': ['Electrolytes'],
'kaaliumi soolad': ['Electrolytes'],

'magneesium': ['Electrolytes'],
'magneesiumkloriid': ['Electrolytes'],
'magneesiumoksiid': ['Electrolytes'],
'magneesiumtsitraat': ['Electrolytes'],
'magneesiumkarbonaat': ['Electrolytes'],
'magneesiumglükonaat': ['Electrolytes'],
'magneesiumlaktaat': ['Electrolytes'],
'magneesiumisoolad': ['Electrolytes'],
'magneesiumi soolad': ['Electrolytes'],

'kaltsium': ['Electrolytes'],
'kaltsiumkloriid': ['Electrolytes'],
'kaltsiumkarbonaat': ['Electrolytes'],
'kaltsiumlaktaat': ['Electrolytes'],
'kaltsiumglükonaat': ['Electrolytes'],
'kaltsiumtsitraat': ['Electrolytes'],
'kaltsiumfosfaat': ['Electrolytes'],
'kaltsiumisoolad': ['Electrolytes'],
'kaltsiumi soolad': ['Electrolytes'],

'kloriid': ['Electrolytes', 'Salts'],
'kloriiditsitraat': ['Electrolytes', 'Salts'],
  
  // Caffeine sources (Kofeiini allikad)
  'kofeiin': ['Caffeine'],
  'kohvi': ['Caffeine'],
  'kohvi ekstrakt': ['Caffeine'],
  'guaraana': ['Caffeine'],
  'tee ekstrakt': ['Caffeine'],
  'yerba mate': ['Caffeine'],
  
  // Vitamins (Vitamiinid)
  'vitamiin b': ['Vitamins'],
  'vitamiin c': ['Vitamins'],
  'vitamiin d': ['Vitamins'],
  'niatsiin': ['Vitamins'],
  'riboflaviin': ['Vitamins'],
  'tiamiin': ['Vitamins'],
  'biotiin': ['Vitamins'],
  'folaat': ['Vitamins'],
  'foolhape': ['Vitamins'],
  
  // Amino acids (Aminohapped)
  'tauriin': ['Amino Acids'],
  'l-teaniin': ['Amino Acids', 'Nootropics'],
  'l-türosiin': ['Amino Acids', 'Nootropics'],
  'l-karnitiin': ['Amino Acids'],
  'bcaa': ['Amino Acids'],
  'kreatiin': ['Amino Acids'],
  
  // Adaptogens (Adaptogeenid)
  'ashwagandha': ['Adaptogens'],
  'roosijuur': ['Adaptogens'], // Rhodiola in Estonian
  'ženšenn': ['Adaptogens'], // Ginseng in Estonian
  'maca': ['Adaptogens'],
  
  // Nootropics (Nootropikad)
  'alfa-gpc': ['Nootropics'],
  'cdp-koliin': ['Nootropics'],
  'bacopa': ['Nootropics'],
  'hõlmikpuu': ['Nootropics'], // Ginkgo biloba in Estonian
  'ginko biloba': ['Nootropics'], // Alternative spelling sometimes used
  
  // Additional Estonian translations for common ingredients
  'sool': ['Salts'],
  'meresool': ['Salts'],
  'valguisolaat': ['Amino Acids'],
  'vadakuvalk': ['Amino Acids'],
};