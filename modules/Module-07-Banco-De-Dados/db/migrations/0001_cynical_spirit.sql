CREATE TABLE "professor_subject" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professorId" uuid NOT NULL,
	"subjectId" uuid NOT NULL,
	CONSTRAINT "professor_subject_professorId_subjectId_unique" UNIQUE("professorId","subjectId")
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" integer NOT NULL,
	"comment" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"professorSubjectId" uuid NOT NULL,
	CONSTRAINT "rating_value_check" CHECK ("ratings"."value" >= 1 AND "ratings"."value" <= 5)
);
--> statement-breakpoint
ALTER TABLE "professor" DROP CONSTRAINT "professor_subjectId_subjects_id_fk";
--> statement-breakpoint
ALTER TABLE "professor_subject" ADD CONSTRAINT "professor_subject_professorId_professor_id_fk" FOREIGN KEY ("professorId") REFERENCES "public"."professor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professor_subject" ADD CONSTRAINT "professor_subject_subjectId_subjects_id_fk" FOREIGN KEY ("subjectId") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_professorSubjectId_professor_subject_id_fk" FOREIGN KEY ("professorSubjectId") REFERENCES "public"."professor_subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professor" DROP COLUMN "subjectId";--> statement-breakpoint
ALTER TABLE "professor" DROP COLUMN "averageRating";