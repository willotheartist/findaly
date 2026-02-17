// app/add-listing/_components/steps/Step3Details.tsx
"use client";

import * as React from "react";
import FormSection from "../FormSection";
import Input from "../fields/Input";
import Select from "../fields/Select";
import TextArea from "../fields/TextArea";
import CheckboxGroup from "../fields/CheckboxGroup";
import {
  BRANDS,
  CHARTER_INCLUDED_OPTIONS,
  FUEL_TYPES,
  HULL_MATERIALS,
  HULL_TYPES,
} from "../../_data/options";
import type { FormData, ListingType, BoatCategory, CharterType } from "../../_types/listing";

/* ─── Styled radio ─── */
function RadioOption({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          checked ? "border-[#0a211f]" : "border-[#ccc]"
        }`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-[#0a211f]" />}
      </span>
      <span className="text-[14px] text-[#555]">{label}</span>
    </label>
  );
}

export default function Step3Details({
  listingType,
  formData,
  updateForm,
}: {
  listingType: ListingType;
  formData: FormData;
  updateForm: (updates: Partial<FormData>) => void;
}) {
  if (listingType === "service") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <FormSection title="Service Information">
          <div className="space-y-4">
            <Input
              label="Business / Service Name"
              name="serviceName"
              value={formData.serviceName}
              onChange={(v) => updateForm({ serviceName: v })}
              placeholder="e.g., Riviera Marine Surveys"
              required
            />
            <TextArea
              label="Service Description"
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={(v) => updateForm({ serviceDescription: v })}
              placeholder="Describe your services, experience, and what sets you apart..."
              rows={5}
              required
              maxLength={2000}
            />
            <Input
              label="Years of Experience"
              name="serviceExperience"
              value={formData.serviceExperience}
              onChange={(v) => updateForm({ serviceExperience: v })}
              placeholder="e.g., 15"
              suffix="years"
            />
          </div>
        </FormSection>

        <FormSection title="Service Areas">
          <CheckboxGroup
            label="Where do you operate?"
            options={["French Riviera", "Balearics", "Italy", "Croatia", "Greece", "UK", "Caribbean", "Worldwide"]}
            selected={formData.serviceAreas}
            onChange={(v) => updateForm({ serviceAreas: v })}
            columns={2}
          />
        </FormSection>
      </div>
    );
  }

  // Boat details for sale/charter
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <FormSection title="Basic Information">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={(v) => updateForm({ brand: v })}
              options={BRANDS}
              required
            />
            <Input
              label="Model"
              name="model"
              value={formData.model}
              onChange={(v) => updateForm({ model: v })}
              placeholder="e.g., Oceanis 46.1"
              required
            />
            <Input
              label="Year"
              name="year"
              value={formData.year}
              onChange={(v) => updateForm({ year: v })}
              placeholder="e.g., 2019"
              type="number"
              required
            />
          </div>

          {listingType === "sale" && (
            <div className="flex gap-5">
              <RadioOption
                name="condition"
                label="New"
                checked={formData.condition === "new"}
                onChange={() => updateForm({ condition: "new" })}
              />
              <RadioOption
                name="condition"
                label="Used"
                checked={formData.condition === "used"}
                onChange={() => updateForm({ condition: "used" })}
              />
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Dimensions">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Length (ft)"
              name="lengthFt"
              value={formData.lengthFt}
              onChange={(v) => {
                updateForm({
                  lengthFt: v,
                  lengthM: v ? (parseFloat(v) * 0.3048).toFixed(2) : "",
                });
              }}
              placeholder="46"
              required
            />
            <Input
              label="Length (m)"
              name="lengthM"
              value={formData.lengthM}
              onChange={(v) => {
                updateForm({
                  lengthM: v,
                  lengthFt: v ? (parseFloat(v) / 0.3048).toFixed(1) : "",
                });
              }}
              placeholder="14.0"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Beam (ft)"
              name="beamFt"
              value={formData.beamFt}
              onChange={(v) => updateForm({ beamFt: v })}
              placeholder="14"
            />
            <Input
              label="Beam (m)"
              name="beamM"
              value={formData.beamM}
              onChange={(v) => updateForm({ beamM: v })}
              placeholder="4.3"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Draft (ft)"
              name="draftFt"
              value={formData.draftFt}
              onChange={(v) => updateForm({ draftFt: v })}
              placeholder="7"
            />
            <Input
              label="Draft (m)"
              name="draftM"
              value={formData.draftM}
              onChange={(v) => updateForm({ draftM: v })}
              placeholder="2.1"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Hull & Construction">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Hull Material"
            name="hullMaterial"
            value={formData.hullMaterial}
            onChange={(v) => updateForm({ hullMaterial: v })}
            options={HULL_MATERIALS}
          />
          <Select
            label="Hull Type"
            name="hullType"
            value={formData.hullType}
            onChange={(v) => updateForm({ hullType: v })}
            options={HULL_TYPES}
          />
          <Input
            label="Hull Colour"
            name="hullColor"
            value={formData.hullColor}
            onChange={(v) => updateForm({ hullColor: v })}
            placeholder="e.g., White"
          />
        </div>
      </FormSection>

      <FormSection title="Propulsion">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Engine Make"
            name="engineMake"
            value={formData.engineMake}
            onChange={(v) => updateForm({ engineMake: v })}
            placeholder="e.g., Volvo Penta"
          />
          <Input
            label="Engine Model"
            name="engineModel"
            value={formData.engineModel}
            onChange={(v) => updateForm({ engineModel: v })}
            placeholder="e.g., D3-110"
          />
          <Input
            label="Power"
            name="enginePower"
            value={formData.enginePower}
            onChange={(v) => updateForm({ enginePower: v })}
            placeholder="110"
            suffix="HP"
          />
          <Select
            label="Number of Engines"
            name="engineCount"
            value={formData.engineCount}
            onChange={(v) => updateForm({ engineCount: v })}
            options={["1", "2", "3", "4"]}
          />
          <Input
            label="Engine Hours"
            name="engineHours"
            value={formData.engineHours}
            onChange={(v) => updateForm({ engineHours: v })}
            placeholder="420"
            suffix="hrs"
          />
          <Select
            label="Fuel Type"
            name="fuelType"
            value={formData.fuelType}
            onChange={(v) => updateForm({ fuelType: v })}
            options={FUEL_TYPES}
          />
        </div>
      </FormSection>

      <FormSection title="Accommodation">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Cabins"
            name="cabins"
            value={formData.cabins}
            onChange={(v) => updateForm({ cabins: v })}
            placeholder="3"
          />
          <Input
            label="Berths"
            name="berths"
            value={formData.berths}
            onChange={(v) => updateForm({ berths: v })}
            placeholder="6"
          />
          <Input
            label="Heads"
            name="heads"
            value={formData.heads}
            onChange={(v) => updateForm({ heads: v })}
            placeholder="2"
          />
        </div>
      </FormSection>

      {listingType === "charter" && (
        <FormSection title="Charter Details">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Max Guests"
                name="charterGuests"
                value={formData.charterGuests}
                onChange={(v) => updateForm({ charterGuests: v })}
                placeholder="8"
                required
              />
              <Input
                label="Crew (if crewed)"
                name="charterCrew"
                value={formData.charterCrew}
                onChange={(v) => updateForm({ charterCrew: v })}
                placeholder="2"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Available From"
                name="charterAvailableFrom"
                value={formData.charterAvailableFrom}
                onChange={(v) => updateForm({ charterAvailableFrom: v })}
                type="date"
              />
              <Input
                label="Available To"
                name="charterAvailableTo"
                value={formData.charterAvailableTo}
                onChange={(v) => updateForm({ charterAvailableTo: v })}
                type="date"
              />
            </div>

            <CheckboxGroup
              label="What's included in the price?"
              options={CHARTER_INCLUDED_OPTIONS}
              selected={formData.charterIncluded}
              onChange={(v) => updateForm({ charterIncluded: v })}
              columns={3}
            />
          </div>
        </FormSection>
      )}
    </div>
  );
}