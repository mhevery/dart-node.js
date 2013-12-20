import 'package:js/js.dart';

describe(name, body) => context.describe(name, body);
it(name, body) => context.it(name, body);

var browser = context.browser;
