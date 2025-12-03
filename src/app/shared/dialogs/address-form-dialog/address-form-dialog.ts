import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CountryOption,
  CountyOption,
  LocalityOption,
  StateOption,
} from '@core/models/geography-model';
import { GeographyService } from '@core/services/geography-service';
import { SharedModule } from '@shared/modules';
import { Subject, forkJoin, takeUntil, tap } from 'rxjs';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectChangeEvent } from 'primeng/select';

@Component({
  selector: 'app-address-form-dialog',
  imports: [SharedModule, AutoComplete],
  templateUrl: './address-form-dialog.html',
  styles: ``,
})
export class AddressFormDialog implements OnDestroy {
  private readonly config = inject(DynamicDialogConfig);
  private readonly geographyService = inject(GeographyService);
  public form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    stateId: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    countryId: new FormControl('', [Validators.required]),
    directions: new FormControl(''),
    locality: new FormControl('', [Validators.required]),
  });

  public countries = signal<CountryOption[]>([]);
  public states = signal<StateOption[]>([]);
  public counties = signal<CountyOption[]>([]);
  public localities = signal<LocalityOption[]>([]);

  public filteredLocalities = signal<LocalityOption[]>([]);
  public destroyed$ = new Subject<void>();
  public dialogRef = inject(DynamicDialogRef);
  public loadingData = signal<boolean>(false);

  constructor() {
    this.loadData();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public loadData(): void {
    this.loadingData.set(true);
    this.geographyService
      .getCountries()
      .pipe(
        tap(() => {
          if (this.config.data.address) {
            this.loadStates(this.config.data.address.countryId);
          }
        })
      )
      .subscribe({
        next: (countries) => {
          this.countries.set(countries);
          this.loadingData.set(false);
        },
        error: () => {
          this.loadingData.set(false);
        },
      });
  }

  public patchForm(): void {
    if (this.config.data.address) {
      this.form.patchValue(this.config.data.address);
    }
  }

  public loadStates(countryId: string): void {
    this.loadingData.set(true);
    this.geographyService.getStates(countryId).subscribe({
      next: (states) => {
        this.states.set(states);
        this.loadingData.set(false);
        this.patchForm();
      },
      error: () => {
        this.loadingData.set(false);
      },
    });
  }

  public loadLocalities(stateId: string): void {
    this.loadingData.set(true);
    this.geographyService.getLocalitiesByStateId(stateId).subscribe({
      next: (localities) => {
        this.localities.set(localities);
        this.loadingData.set(false);
      },
      error: () => {
        this.loadingData.set(false);
      },
    });
  }

  public onCountrySelect(event: SelectChangeEvent): void {
    console.log(event);
    this.loadStates(event.value as string);
  }

  public onStateSelect(event: AutoCompleteSelectEvent): void {
    this.loadLocalities(event.value as string);
  }

  public onLocalitySelect(event: AutoCompleteSelectEvent): void {
    this.form.controls.locality.setValue(event.value.name);
  }

  public filterLocalities(event: AutoCompleteCompleteEvent): void {
    this.filteredLocalities.set(
      this.localities().filter((locality) =>
        locality.name.toLowerCase().includes(event.query.toLowerCase())
      )
    );
  }

  public onSubmit(): void {
    console.log(this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.dialogRef.close(this.form.value);
    }
  }
}
