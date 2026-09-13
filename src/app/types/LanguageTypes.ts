import { Config } from "./Config";

type LanguageCode = 'eng' | 'hin' | 'mar' | 'ban' | 'guj' | 'mal' | 'asm' | 'kan' | 'odi' | 'tam' | 'tel';

type StateCode = 'AN' | 'AP' | 'AR' | 'AS' | 'BR' | 'CH' | 'CT' | 'DD' | 'DL' | 'GA' | 'GJ' | 'HR' | 'HP' | 'JK' | 'JH' | 'KA' | 'KL' | 'LA' | 'LD' | 'MP' | 'MH' | 'MN' | 'ML' | 'MZ' | 'NL' | 'OR' | 'PY' | 'PN' | 'RJ' | 'SK' | 'TN' | 'TG' | 'TR' | 'UP' | 'UK' | 'WB' | 'MU';

type StateList = {
    [key in StateCode] : {
        [key in LanguageCode] : string
    }
}

type ConstituencyCode = `${StateCode}${number}`

type ConstituencyList = {
    [key in StateCode] : {
        [key in ConstituencyCode] : {
            [key in LanguageCode] : string
        }
    }
}
type ConfigJson = {
    [key in (LanguageCode) ] : Config
}
& 
{
    "currentLanguage" : LanguageCode
}
export type {
    LanguageCode,
    StateCode,
    StateList,
    ConstituencyList,
    ConstituencyCode,
    ConfigJson
}