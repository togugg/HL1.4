import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SampleAsset } from '../../services/org';
import { Observable, } from 'rxjs';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formConfig } from '../../services/formConfig'
import { MatTableDataSource } from '@angular/material/table';
import { DynamicFormService } from "@ng-dynamic-forms/core";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('updateAssetModal') public exampleModal

  formModel: DynamicFormModel = [];
  formGroup: FormGroup;

  accounts: any;
  //sortedData: SampleAsset[] = [];
  sortedData: SampleAsset[] = [];
  unsortedData: SampleAsset[] = [];
  name = "";
  displayedColumns: string[] = ['assetId', 'owner', 'value', 'delete'];
  dataSource = new MatTableDataSource<SampleAsset>();
  log: any;
  emitter;
  observable = Observable.create(e => this.emitter = e);

  ngOnInit() {
    this.getAllData();
    this.generateForm();
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  getAllData() {
    this.getAll().subscribe(res => {
      this.unsortedData = res;
      this.dataSource.data = this.unsortedData;
    })
  }

  addData(data: SampleAsset) {
    this.addAsset(data).subscribe(() => {
      this.getAllData();
      this.resetForm();
    }
    )
  }

  generateForm() {
    const keys = Object.keys(formConfig.SampleAsset);
    keys.forEach(element => {
      this.formModel.push(
        new DynamicInputModel({
          id: element,
          label: element,
          //maxLength: 42,
          placeholder: element
        }),
      )
      console.log(element)
    });
  }

  resetForm() {
    this.formGroup.reset();
  }

  deleteData(assetId: any, row: any) {
    this.unsortedData.splice(row, 1);
    this.dataSource.data = this.unsortedData;
    this.deleteAsset(assetId).subscribe((res) => {
      console.log(res)

    })
  }

  prepareUpdateForm(row: any) {
    console.log(this.dataSource.data[row])
    this.formGroup.patchValue(
      this.dataSource.data[row]
    );
  }

  updateData(data: SampleAsset) {
    this.updateAsset(data.assetId, data).subscribe(() => {
      this.getAllData();
      this.resetForm();
      this.exampleModal.hide()
    }
    )
  }


  account: any;

  private NAMESPACE = 'org.example.mynetwork.SampleAsset';

  constructor(private dataService: DataService<SampleAsset>,
    private formService: DynamicFormService,
    private fb: FormBuilder,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'trash',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-delete-24px.svg'));

    iconRegistry.addSvgIcon(
      'update',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-delete-24px.svg'));
  }

  public getAll(): Observable<SampleAsset[]> {
    return this.dataService.getAll(this.NAMESPACE);
  }

  public getAsset(id: any): Observable<SampleAsset> {
    return this.dataService.getSingle(this.NAMESPACE, id);
  }

  public addAsset(itemToAdd: any): Observable<SampleAsset> {
    return this.dataService.add(this.NAMESPACE, itemToAdd);
  }

  public updateAsset(id: any, itemToUpdate: any): Observable<SampleAsset> {
    return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
  }

  public deleteAsset(id: any): Observable<SampleAsset> {
    return this.dataService.delete(this.NAMESPACE, id);
  }



}


import {
  DynamicFormModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from "@ng-dynamic-forms/core";

