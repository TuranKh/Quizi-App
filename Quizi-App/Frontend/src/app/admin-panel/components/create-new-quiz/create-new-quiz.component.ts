import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { QuizService } from 'src/app/services/quiz.service';
import { AdminService } from 'src/app/services/admin.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-create-new-quiz',
  templateUrl: './create-new-quiz.component.html',
  styleUrls: ['./create-new-quiz.component.scss'],
})
export class CreateNewQuizComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private _adminService: AdminService,
    private snackBar: SnackbarService
  ) { }

  ngOnInit(): void { }

  @ViewChild('fileInput') fileInput?: ElementRef;

  answerOptions = ['A', 'B', 'C', 'D', 'E'];

  questionsImages: FormArray<
    FormGroup<{
      trueAnswer: FormControl<any>;
      imageName: FormControl<any>;
      file: FormControl<any>;
    }>
  > = this.fb.array<FormGroup>([]);
  url: any;

  finalForm = this.fb.group({
    quizName: ['', Validators.required],
    quizDuration: [null, Validators.required],
  });

  selectedFilesNumber = 0;
  filesMap = new Map();

  countSelectedQuestions(e: any) {
    for (const file of e.target.files as Array<File>) {
      const quizForm: any = ([] = []);
      this.questionsImages = new FormArray(quizForm);
      const reader = new FileReader();
      reader.onload = (_event) => {
        this.filesMap.set(file.name, { file, imageSrc: reader.result });
        const questionFormGroup = this.fb.group({
          imageName: file.name,
          trueAnswer: [null, Validators.required],
          file: reader.result,
        });
        this.questionsImages.push(questionFormGroup);
        this.selectedFilesNumber = this.questionsImages.controls.length;
      };
      reader.readAsDataURL(file);
    }

    const fileInput = this.fileInput?.nativeElement as HTMLInputElement;
    if (fileInput != null) {
      fileInput.value = '';
    }
  }

  removeQuestions() {
    this.filesMap.clear();
    this.questionsImages.clear();
    this.selectedFilesNumber = 0;
  }

  createQuiz() {
    const params = {
      quizName: this.finalForm.value.quizName,
      quizDuration: this.finalForm.value.quizDuration,
      trueAnswers: this.questionsImages.value.map(
        (question) => question.trueAnswer + 1
      ),
    };


    const formData = new FormData();
    this.filesMap.forEach((file: { file: File }) => {
      formData.append('photos', file.file, file.file.name);
    });

    this._adminService.sendQuestions(params, formData).subscribe((res: any) => {
      this.snackBar.openSuccessSnackBar('Suallar uğurla əlavə olundu!')
    },
      (err => {
        this.snackBar.openFailureSnackBar('Xəta baş verdi!', 'Yenidən cəhd edin')
      }));
  }

  get createQuizDisabled() {
    const formValue = this.finalForm.value;
    const images = this.questionsImages.value;
    const checkIfAnswerSelected = (image: any) => image.trueAnswer == null;
    const answersNotSelectedFully = images.some(checkIfAnswerSelected);
    if (answersNotSelectedFully) {
      return true;
    }

    return (
      this.selectedFilesNumber === 0 ||
      formValue.quizName?.length === 0 ||
      formValue.quizDuration == null ||
      formValue.quizDuration == '' ||
      isNaN(formValue.quizDuration)
    );
  }

  removeCurrentQuestion(index: number) {
    this.filesMap.delete(
      this.questionsImages.controls[index].get('imageName')?.value
    );
    this.questionsImages.removeAt(index);
    this.selectedFilesNumber = this.questionsImages.controls.length;
  }

  addCorrectAnswer(questionIndex: number, answerIndex: number) {
    this.questionsImages.controls[questionIndex].patchValue({
      trueAnswer: answerIndex,
    });
  }
}
