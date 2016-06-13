## Open museum
Open Platform for the Redpath museum.

## Develop
1. Clone the repository:
```
git clone https://github.com/RedpathMuseum/open-museum.git
```
2. Install the dependencies:
```
npm install && bower install
```
3. Start the development server:
```
gulp serve
```

## Add a bower dependency
1. Install and save using bower
```
bower --save install <dependency>
```
2. Insert in html
```
gulp wiredep
```
