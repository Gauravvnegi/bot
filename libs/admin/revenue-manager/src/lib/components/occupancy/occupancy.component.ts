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
      }
    });
  }

  initForm() {
    this.useForm = this.fb.group({
      status: [false],
      season: this.fb.array([]),
    });
    this.addSeasonControl();
  }

  addSeasonControl() {
    this.seasonControl.push(
      this.fb.group({
        name: ['', [Validators.required]],
        fromDate: [this.currentDay, [Validators.required]],
        toDate: [this.seventhDay, [Validators.required]],
        roomType: [
          this.allRooms.map((item) => item.value),
          [Validators.required],
        ],
        selectedDays: ['', [Validators.required]],
      })
    );
    const seasonIndex = this.seasonControl.length - 1;
    const seasonFG = this.seasonControl.at(seasonIndex) as FormGroup;
    const seasonArray = this.seasonControl.at(seasonIndex) as FormGroup;
    seasonFG.get('roomType').valueChanges.subscribe((res: string[]) => {
      seasonArray.removeControl('roomTypes');
      seasonArray.addControl('roomTypes', this.fb.array([]));
      this.addRoomTypeOccupancy(seasonFG);
    });

    seasonArray.addControl('roomTypes', this.fb.array([]));
    this.addRoomTypeOccupancy(seasonFG);
  }

  removeSeason(seasonIndex: number) {
    this.seasonControl.removeAt(seasonIndex);
  }

  seasonStatusChange(status, seasonIndex: number) {
    this.seasonControl.at(seasonIndex).patchValue({ status: status });
  }

  addRoomTypeOccupancy(seasonControl: FormGroup) {
    const selectedRooms = seasonControl.get('roomType').value;
    const roomTypeFA = seasonControl.get('roomTypes') as FormArray;
    this.allRooms
      .filter((room) => selectedRooms.includes(room.value))
      .forEach((room, idx) => {
        roomTypeFA.controls.push(
          this.fb.group({
            roomId: [room.value],
            roomName: [room.label],
            basePrice: [room.price],
          })
        );
        const roomType = roomTypeFA.at(idx) as FormGroup;
        roomType.addControl(
          'occupancy',
          this.fb.array([], [Validators.required])
        );
        this.addOccupancyControl(roomType);
      });
  }

  addOccupancyControl(occupancyFG: FormGroup) {
    const occupancyFA = occupancyFG.get('occupancy') as FormArray;
    occupancyFA.push(
      this.fb.group({
        start: [, [Validators.min(0), Validators.required]],
        end: [, [Validators.min(0), Validators.required]],
        discount: [, [Validators.min(0), Validators.required]],
        rate: [, [Validators.min(0), Validators.required]],
      })
    );

    const basePrice = occupancyFG.get('basePrice').value;
    const occupancyFA__FG = occupancyFA.at(occupancyFA.length - 1);
    occupancyFA__FG.get('discount').valueChanges.subscribe((percentage) => {
      occupancyFA__FG.patchValue(
        { rate: (basePrice * +percentage) / 100 },
        { emitEvent: false }
      );
    });

    occupancyFA__FG.get('rate').valueChanges.subscribe((rate) => {
      const percentage = (+rate / basePrice) * 100;
      occupancyFA__FG.patchValue(
        { discount: percentage.toFixed(2) },
        { emitEvent: false }
      );
    });
  }

  removeOccupancyControl(occupancyFG: FormGroup, occupancyIndex: number) {
    (occupancyFG.get('occupancy') as FormArray).removeAt(occupancyIndex);
  }

  get seasonControl() {
    return this.useForm.get('season') as FormArray;
  }

  get formControls() {
    return (this.useForm?.get('season') as FormArray)?.controls;
  }

  handleSave() {
    console.log(this.useForm);
  }
}
