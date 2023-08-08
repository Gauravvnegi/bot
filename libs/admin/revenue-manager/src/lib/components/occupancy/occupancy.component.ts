import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import { weeks } from 'libs/admin/channel-manager/src/lib/components/constants/bulkupdate-response';
import { BarPriceService } from '../../services/bar-price.service';
import { RoomTypes } from '../../types/bar-price.types';

@Component({
  selector: 'hospitality-bot-occupancy',
  templateUrl: './occupancy.component.html',
  styleUrls: ['./occupancy.component.scss'],
})
export class OccupancyComponent implements OnInit {
  loading = false;
  footerNote = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Error eos
  alias consequuntur necessitatibus dolore, fugit eligendi, exercitationem
  quia iste nemo nulla eveniet, doloribus sit vero? Laboriosam inventore
  deleniti autem illum!`;
  entityId = '';
  useForm: FormGroup;
  allRooms: RoomTypes[];
  currentDay = new Date();
  seventhDay = new Date();
  weeks = weeks;

  constructor(
    private fb: FormBuilder,
    private dynamicPricingService: DynamicPricingService,
    private barPriceService: BarPriceService,
    private globalFilter: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.initRoom();
  }

  initRoom() {
    this.currentDay.setHours(0, 0, 0, 0);
    this.seventhDay.setHours(0, 0, 0, 0);
    this.seventhDay.setDate(this.seventhDay.getDate() + 7);
    this.barPriceService.roomDetails.subscribe((res) => {
      if (this.barPriceService.isRoomDetailsLoaded) {
        this.allRooms = res;
        this.initForm();
      } else {
        this.barPriceService.loadRoomTypes(this.entityId);
      }
    });
  }

  initForm() {
    this.useForm = this.fb.group({
      season: this.fb.array([]),
    });
    this.addSeasonControl();
    console.log(this.useForm);
  }

  addSeasonControl() {
    this.seasonControl.push(
      this.fb.group({
        name: ['', [Validators.required]],
        fromDate: [this.currentDay, [Validators.required]],
        toDate: [this.seventhDay, [Validators.required]],
        roomType: ['', [Validators.required]],
        selectedDays: ['', [Validators.required]],
        roomTypes: this.fb.array([]),
      })
    );
    this.addRoomTypeOccupancy(this.seasonControl.at(0) as FormGroup, 0);
  }

  addRoomTypeOccupancy(seasonControl: FormGroup, roomTypeIdx: number) {
    this.allRooms.forEach((room, idx) => {
      (seasonControl.get('roomTypes') as FormArray).push(
        this.fb.group({
          occupancy: this.fb.array([], [Validators.required]),
        })
      );
      const roomType = (this.seasonControl
        .at(roomTypeIdx)
        .get('roomTypes') as FormArray).at(idx);
      this.addOccupancyControl(roomType as FormGroup, room);
    });
  }

  addOccupancyControl(occupancyFG: FormGroup, room: RoomTypes) {
    (occupancyFG.get('occupancy') as FormArray).push(
      this.fb.group({
        value: [room.value],
        label: [room.label],
        rates: [room.price],
        start: [],
        end: [],
        discount: [],
      })
    );
  }

  get seasonControl() {
    return this.useForm.get('season') as FormArray;
  }

  get formControls() {
    return (this.useForm?.get('season') as FormArray)?.controls;
  }

  handleSave() {}
}
