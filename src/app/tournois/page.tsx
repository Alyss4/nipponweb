'use client';

import React, { useState, ChangeEvent } from 'react';
import { Input, Select, Radio, Checkbox, ButtonPrimaryy } from '../../components/ComponentForm';
import TournoiAPrevoirForm from '@/components/componentsPages/TournoiAPrevoirForm';
import TournoiSurPlaceForm from '@/components/componentsPages/TournoiSurPlaceForm';

export default function Tournois() {
 
  return (
    <>
    <TournoiSurPlaceForm/>
    </>
  );
}
