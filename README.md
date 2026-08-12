# Improved Quizlet

Improved Quizlet is a vocab quiz site I wrote to replace Quizlet's study modes.  

Instead of flashcards or multiple choice, every term shows up as a row in a table with a text box next to it. You type the answer, hit Enter, and it tells you how you did right away.

I started it in April 2023 for Spanish 1 and have adapted it for every Spanish class since (2/3/AP).

## Features

- **Typing instead of flashcards.** Each definition is a text input. Answers get checked when you press Enter (which plays a sound and jumps to the next box) and again when you click away.
- **Loose answer matching.** Everything is lowercased and stripped of punctuation and spaces before comparing. There's also an "Ignore Accents" setting that normalizes `á é í ó ú ü ñ`.
- **Verb charts.** This is a custom mode for conjugation sets, allowing a set to have more than one answer column. The header row switches based on which set you picked.
- **Mixing sets.** Check as many sets as you want and the terms get pooled together and shuffled.
- **Both directions.** A toggle flips between Spanish to English and English to Spanish.
- **Progress bar** at the bottom with a live percentage and correct/total count.
- **Settings** for hiding whether you got it right, ignoring accents, muting sounds, and testing in columns (going down a column instead of across a row). All of them stick between visits.
- **Nothing is lost if you close the tab.** Selected sets, settings, and every answer you've typed go into `localStorage`.
- **Sounds.** Random success and failure chimes, muted by default.
- **Accent helper.** A `/copy` page with click-to-copy `á é í ó ú ü ñ ¿ ¡` for when typing accents is not possible.

## Architecture

### Build pipeline

Improved Quizlet is built without a framework. Rather, it compiles the HTML, CSS, JS, and asset files into a single, self-contained `index.html` file using [PugJS](https://pugjs.org/).

- CSS and JS get inlined with `include`
- Each study set's raw text gets stored in a `<meta>` tag
- The MP3 sound effects get base64'd into inline `<audio>` elements

Each course ends up as a single HTML file that makes no network requests once it loads.  

`index.js` is a small Express server that serves the compiled output.

### Study set format

Study sets are created using tab-separated text, one term per line. First column is the term, every column after it is an answer field.

```
a partir de	beginning with
al principio	at the beginning
```

Conjugation sets just add more tabs:

```
buscar	to look for	busco	buscas	busca	buscamos	buscan
caber	to fit	quepo	cabes	cabe	cabemos	caben
```

Each course's `options.json` controls which sets show up and how they're grouped:

```json
[
  {
    "name": "quiz",
    "display": "Quiz Study Sets",
    "sets": [["quiz1", "Quiz 1: Expresiones que facilitan la comunicación"]]
  }
]
```

### How to run it

```bash
npm install
node compile.js      # compiles index.html file for each course
node index.js        # serves the generated files on localhost
```

## Project Structure

| Directory | What it is |
| --- | --- |
| `src/` | Source code for the **most recent version** of Improved Quizlet - AP Spanish (2025-26). At the end of each school year I copy it into its own directory and empty it out for the next class. Holds the current `index.pug`, `css/`, `js/`, `sounds/`, `sets/`, and `options.json`. |
| `spanish2/` | Spanish 2 (2025-26) - rebuilt from scratch and continued updating through May 2026. 13 sets covering different tenses, vocab units, and final exam review. |
| `spanish3/` | Spanish 3 (2024-25). 16 sets: subjunctive split by trigger type (will/influence, emotion, doubt/denial), verb charts, and vocab units 1 through 5. |
| `spanish2old/` | Spanish 2 (2023-24) - the original site. 26 sets on subjunctive, commands, and housing/nature/medical vocab. Archived in October 2025 to get the rebuild ready. |
| `spanish1/` | Spanish 1 (2022-23), the biggest one at 42 sets. Every regular and stem-changing verb family in both infinitive and conjugated form, plus the basic vocab (colors, numbers, family, body, school, greetings). |
| `copy/` | The accent copying page. One standalone `index.html` that gets copied straight into the build. |
| `serve/` | Build output, gitignored. One `index.html` per course. |

Every course directory has the same layout:

```
<course>/
  index.pug        page template: navbar, settings panel, set chooser, quiz table
  options.json     set groupings and display names
  sets/*.txt       tab-separated term/definition data
  css/             style.css (layout) + toggle.css (the switch)
  js/              script.js (quiz engine), settings.js, cookie.js (restores
                   saved state), reset.js (localStorage helpers), sound.js
  sounds/          success1-4.mp3, failure1-2.mp3
```

The old course directories are frozen. Each one keeps its own copy of the JS and CSS from whenever that class ended, so they still work the way they did back then. `spanish1/` and `spanish2old/` even still have the `animation.js` splash screen I dropped in the 2025 redesign.

## Timeline

**April 2023 - v1**  
The first version was a single `index.html` with the verb sets written into the markup, and the core of it works the same way today: a table of terms with a text box on every row, and it checks your answer the moment you hit Enter. The day after I started I added accent-insensitive matching, so `esta` counts for `está` and you can get through a set without reaching for accent keys.

**May 2023 - v2**  
On the 23rd I moved the page into a Pug template and wrote `compile.js`, which inlines the CSS, JS, and study sets into one HTML file. That's still how the site builds, and it's why each course comes out as a single file that keeps working with no network once it loads. The rest of the month went into the quiz itself, so that Enter carries you straight to the next box and a term you miss shows you the answer you were going for.

**August 2023 - v3**  
August is when it grew into a site for every Spanish class. On the 24th I moved Spanish 1 into `spanish1/` and opened up `src/` for Spanish 2, which is the routine I've followed every August since, and the two weeks after that gave the site most of what it can do. Verb charts were the centerpiece: a conjugation set can define its own header row, so instead of one answer per term you fill in a full chart across the row. Shuffling arrived the same week, along with a switch for testing Spanish to English or English to Spanish. The quiz engine has been stable ever since.

**2024 - maintenance**  
February brought tú/usted/ustedes commands, and supporting them made verb charts more general, since any set can now supply the header row that fits it. In August I did the second reset and moved Spanish 2 into `spanish2/` so `src/` could become Spanish 3. Most of the rest of the year went into study set content.

**August 2025 - v4**  
Third reset on the 4th, and then a week on the setup around the site. I moved off Replit to a local Express server on port 3456, and I took `node_modules/`, `package-lock.json`, and `serve/` out of git so the repo holds just the source. After that I rebuilt the interface into the flex layout it uses now, with Settings and Study Topics as collapsible panels that keep the quiz table front and center.

**October 2025 - v5**  
The Spanish 2 site was two years old by this point, so I renamed the original to `spanish2old/` and rebuilt Spanish 2 on the current codebase, which brought it the newer layout and everything else the code had picked up since 2023. It's the only course I've carried forward that way, and the rest stay as they were.

**Oct 2025 to May 2026**  
Two classes running at the same time. AP Spanish quizzes 1 through 10 went into `src/` as the year went on, and `spanish2/` grew alongside it with unit vocab, mandatos, the imperfect tense, and a full set of final exam review in May.
