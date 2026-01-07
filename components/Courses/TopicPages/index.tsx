import React from 'react'

// Math
import Topic_10_math_1 from './10-math-1'
import Topic_10_math_2 from './10-math-2'
import Topic_10_math_3 from './10-math-3'
import Topic_10_math_4 from './10-math-4'
import Topic_10_math_5 from './10-math-5'
import Topic_10_math_6 from './10-math-6'
import Topic_10_math_7 from './10-math-7'
import Topic_10_math_8 from './10-math-8'
import Topic_10_math_9 from './10-math-9'
import Topic_10_math_10 from './10-math-10'
import Topic_10_math_11 from './10-math-11'
import Topic_10_math_12 from './10-math-12'
import Topic_10_math_13 from './10-math-13'
import Topic_10_math_14 from './10-math-14'
import Topic_10_math_15 from './10-math-15'
import Topic_10_math_16 from './10-math-16'
import Topic_10_math_17 from './10-math-17'
import Topic_10_math_18 from './10-math-18'
import Topic_10_math_19 from './10-math-19'
import Topic_10_math_20 from './10-math-20'

// English
import Topic_10_engl_1 from './10-engl-1'
import Topic_10_engl_2 from './10-engl-2'
import Topic_10_engl_3 from './10-engl-3'
import Topic_10_engl_4 from './10-engl-4'
import Topic_10_engl_6 from './10-engl-6'
import Topic_10_engl_7 from './10-engl-7'
import Topic_10_engl_8 from './10-engl-8'
import Topic_10_engl_9 from './10-engl-9'
import Topic_10_engl_10 from './10-engl-10'
import Topic_10_engl_11 from './10-engl-11'
import Topic_10_engl_12 from './10-engl-12'
import Topic_10_engl_13 from './10-engl-13'
import Topic_10_engl_14 from './10-engl-14'
import Topic_10_engl_15 from './10-engl-15'
import Topic_10_engl_16 from './10-engl-16'
import Topic_10_engl_17 from './10-engl-17'
import Topic_10_engl_18 from './10-engl-18'
import Topic_10_engl_19 from './10-engl-19'
import Topic_10_engl_20 from './10-engl-20'

// Hindi
import Topic_10_hind_1 from './10-hind-1'
import Topic_10_hind_2 from './10-hind-2'
import Topic_10_hind_3 from './10-hind-3'
import Topic_10_hind_4 from './10-hind-4'
import Topic_10_hind_5 from './10-hind-5'
import Topic_10_hind_6 from './10-hind-6'
import Topic_10_hind_7 from './10-hind-7'
import Topic_10_hind_8 from './10-hind-8'
import Topic_10_hind_9 from './10-hind-9'
import Topic_10_hind_10 from './10-hind-10'
import Topic_10_hind_11 from './10-hind-11'
import Topic_10_hind_12 from './10-hind-12'
import Topic_10_hind_13 from './10-hind-13'
import Topic_10_hind_14 from './10-hind-14'
import Topic_10_hind_15 from './10-hind-15'
import Topic_10_hind_16 from './10-hind-16'
import Topic_10_hind_17 from './10-hind-17'
import Topic_10_hind_18 from './10-hind-18'
import Topic_10_hind_19 from './10-hind-19'
import Topic_10_hind_20 from './10-hind-20'

// Science
import Topic_10_scie_1 from './10-scie-1'
import Topic_10_scie_2 from './10-scie-2'
import Topic_10_scie_3 from './10-scie-3'
import Topic_10_scie_4 from './10-scie-4'
import Topic_10_scie_5 from './10-scie-5'
import Topic_10_scie_6 from './10-scie-6'
import Topic_10_scie_7 from './10-scie-7'
import Topic_10_scie_8 from './10-scie-8'
import Topic_10_scie_9 from './10-scie-9'
import Topic_10_scie_10 from './10-scie-10'
import Topic_10_scie_11 from './10-scie-11'
import Topic_10_scie_12 from './10-scie-12'
import Topic_10_scie_13 from './10-scie-13'
import Topic_10_scie_14 from './10-scie-14'
import Topic_10_scie_15 from './10-scie-15'
import Topic_10_scie_16 from './10-scie-16'
import Topic_10_scie_17 from './10-scie-17'
import Topic_10_scie_18 from './10-scie-18'
import Topic_10_scie_19 from './10-scie-19'
import Topic_10_scie_20 from './10-scie-20'

// SocialScience
import Topic_10_soci_1 from './10-soci-1'
import Topic_10_soci_2 from './10-soci-2'
import Topic_10_soci_3 from './10-soci-3'
import Topic_10_soci_4 from './10-soci-4'
import Topic_10_soci_5 from './10-soci-5'
import Topic_10_soci_6 from './10-soci-6'
import Topic_10_soci_7 from './10-soci-7'
import Topic_10_soci_8 from './10-soci-8'
import Topic_10_soci_9 from './10-soci-9'
import Topic_10_soci_10 from './10-soci-10'
import Topic_10_soci_11 from './10-soci-11'
import Topic_10_soci_12 from './10-soci-12'
import Topic_10_soci_13 from './10-soci-13'
import Topic_10_soci_14 from './10-soci-14'
import Topic_10_soci_15 from './10-soci-15'
import Topic_10_soci_16 from './10-soci-16'
import Topic_10_soci_17 from './10-soci-17'
import Topic_10_soci_18 from './10-soci-18'
import Topic_10_soci_19 from './10-soci-19'
import Topic_10_soci_20 from './10-soci-20'

// Base topics
import Topic_12_phy_ncert from './12-phy-ncert'
import Topic_10_math_cbse from './10-math-cbse'

export const TOPIC_PAGES: Record<string, React.FC> = {
  '12-phy-ncert': Topic_12_phy_ncert,
  '10-math-cbse': Topic_10_math_cbse,

  // math
  '10-math-1': Topic_10_math_1,
  '10-math-2': Topic_10_math_2,
  '10-math-3': Topic_10_math_3,
  '10-math-4': Topic_10_math_4,
  '10-math-5': Topic_10_math_5,
  '10-math-6': Topic_10_math_6,
  '10-math-7': Topic_10_math_7,
  '10-math-8': Topic_10_math_8,
  '10-math-9': Topic_10_math_9,
  '10-math-10': Topic_10_math_10,
  '10-math-11': Topic_10_math_11,
  '10-math-12': Topic_10_math_12,
  '10-math-13': Topic_10_math_13,
  '10-math-14': Topic_10_math_14,
  '10-math-15': Topic_10_math_15,
  '10-math-16': Topic_10_math_16,
  '10-math-17': Topic_10_math_17,
  '10-math-18': Topic_10_math_18,
  '10-math-19': Topic_10_math_19,
  '10-math-20': Topic_10_math_20,

  // english
  '10-engl-1': Topic_10_engl_1,
  '10-engl-2': Topic_10_engl_2,
  '10-engl-3': Topic_10_engl_3,
  '10-engl-4': Topic_10_engl_4,
  '10-engl-6': Topic_10_engl_6,
  '10-engl-7': Topic_10_engl_7,
  '10-engl-8': Topic_10_engl_8,
  '10-engl-9': Topic_10_engl_9,
  '10-engl-10': Topic_10_engl_10,
  '10-engl-11': Topic_10_engl_11,
  '10-engl-12': Topic_10_engl_12,
  '10-engl-13': Topic_10_engl_13,
  '10-engl-14': Topic_10_engl_14,
  '10-engl-15': Topic_10_engl_15,
  '10-engl-16': Topic_10_engl_16,
  '10-engl-17': Topic_10_engl_17,
  '10-engl-18': Topic_10_engl_18,
  '10-engl-19': Topic_10_engl_19,
  '10-engl-20': Topic_10_engl_20,

  // hindi
  '10-hind-1': Topic_10_hind_1,
  '10-hind-2': Topic_10_hind_2,
  '10-hind-3': Topic_10_hind_3,
  '10-hind-4': Topic_10_hind_4,
  '10-hind-5': Topic_10_hind_5,
  '10-hind-6': Topic_10_hind_6,
  '10-hind-7': Topic_10_hind_7,
  '10-hind-8': Topic_10_hind_8,
  '10-hind-9': Topic_10_hind_9,
  '10-hind-10': Topic_10_hind_10,
  '10-hind-11': Topic_10_hind_11,
  '10-hind-12': Topic_10_hind_12,
  '10-hind-13': Topic_10_hind_13,
  '10-hind-14': Topic_10_hind_14,
  '10-hind-15': Topic_10_hind_15,
  '10-hind-16': Topic_10_hind_16,
  '10-hind-17': Topic_10_hind_17,
  '10-hind-18': Topic_10_hind_18,
  '10-hind-19': Topic_10_hind_19,
  '10-hind-20': Topic_10_hind_20,

  // science
  '10-scie-1': Topic_10_scie_1,
  '10-scie-2': Topic_10_scie_2,
  '10-scie-3': Topic_10_scie_3,
  '10-scie-4': Topic_10_scie_4,
  '10-scie-5': Topic_10_scie_5,
  '10-scie-6': Topic_10_scie_6,
  '10-scie-7': Topic_10_scie_7,
  '10-scie-8': Topic_10_scie_8,
  '10-scie-9': Topic_10_scie_9,
  '10-scie-10': Topic_10_scie_10,
  '10-scie-11': Topic_10_scie_11,
  '10-scie-12': Topic_10_scie_12,
  '10-scie-13': Topic_10_scie_13,
  '10-scie-14': Topic_10_scie_14,
  '10-scie-15': Topic_10_scie_15,
  '10-scie-16': Topic_10_scie_16,
  '10-scie-17': Topic_10_scie_17,
  '10-scie-18': Topic_10_scie_18,
  '10-scie-19': Topic_10_scie_19,
  '10-scie-20': Topic_10_scie_20,

  // socialscience
  '10-soci-1': Topic_10_soci_1,
  '10-soci-2': Topic_10_soci_2,
  '10-soci-3': Topic_10_soci_3,
  '10-soci-4': Topic_10_soci_4,
  '10-soci-5': Topic_10_soci_5,
  '10-soci-6': Topic_10_soci_6,
  '10-soci-7': Topic_10_soci_7,
  '10-soci-8': Topic_10_soci_8,
  '10-soci-9': Topic_10_soci_9,
  '10-soci-10': Topic_10_soci_10,
  '10-soci-11': Topic_10_soci_11,
  '10-soci-12': Topic_10_soci_12,
  '10-soci-13': Topic_10_soci_13,
  '10-soci-14': Topic_10_soci_14,
  '10-soci-15': Topic_10_soci_15,
  '10-soci-16': Topic_10_soci_16,
  '10-soci-17': Topic_10_soci_17,
  '10-soci-18': Topic_10_soci_18,
  '10-soci-19': Topic_10_soci_19,
  '10-soci-20': Topic_10_soci_20,
}

export function getTopicComponentById(id: string): React.FC | null {
  return TOPIC_PAGES[id] || null
}

export default TOPIC_PAGES
